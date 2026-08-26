"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTodayDate } from "@/utils/auth";
import Header from "@/components/ui/Header/Header";
import {
  getCategoryLabel,
  getCategoryColor,
} from "@/utils/category";

export default function TaskListClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // =====================================================
  // Category از URL
  // مثال:
  // /task-list?category=work
  // =====================================================

  const categoryId = searchParams.get("category");

  // =====================================================
  // Tasks
  // =====================================================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // دریافت Tasks
  // =====================================================

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        let url = "/api/tasks";

        if (categoryId) {
          url += `?category=${encodeURIComponent(categoryId)}`;
        }

        const res = await fetch(url);

        const result = await res.json();

        if (!res.ok) {
          console.error(
            result.error ||
              result.message ||
              "خطا در دریافت کارها"
          );

          setTasks([]);
          return;
        }

        setTasks(result.data || []);
      } catch (error) {
        console.error("Fetch tasks error:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [categoryId]);

  // =====================================================
  // حذف Task
  // =====================================================

  const handleDelete = async (todoId) => {
    const confirmed = window.confirm(
      "آیا از حذف این کار مطمئن هستید؟"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/tasks/${todoId}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.error ||
            result.message ||
            "خطا در حذف کار"
        );

        return;
      }

      // حذف از State
      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== todoId
        )
      );

      alert("کار با موفقیت حذف شد.");
    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );

      alert("خطا در ارتباط با سرور.");
    }
  };

  // =====================================================
  // تغییر وضعیت انجام شدن Task
  // =====================================================

  const handleCheckboxChange = async (task) => {
    const newStatus = !task.isCompleted;

    // -----------------------------------------------
    // Optimistic Update
    // -----------------------------------------------

    setTasks((prev) =>
      prev.map((item) =>
        item._id === task._id
          ? {
              ...item,
              isCompleted: newStatus,
            }
          : item
      )
    );

    try {
      const res = await fetch(
        `/api/tasks/${task._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            isCompleted: newStatus,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        // -------------------------------------------
        // Rollback
        // -------------------------------------------

        setTasks((prev) =>
          prev.map((item) =>
            item._id === task._id
              ? {
                  ...item,
                  isCompleted:
                    !newStatus,
                }
              : item
          )
        );

        alert(
          result.error ||
            result.message ||
            "خطا در ذخیره وضعیت کار"
        );
      }
    } catch (error) {
      console.error(
        "Toggle task error:",
        error
      );

      // -----------------------------------------------
      // Rollback
      // -----------------------------------------------

      setTasks((prev) =>
        prev.map((item) =>
          item._id === task._id
            ? {
                ...item,
                isCompleted:
                  !newStatus,
              }
            : item
        )
      );

      alert("خطا در ارتباط با سرور.");
    }
  };

  // =====================================================
  // ویرایش Task
  // =====================================================

  const handleEdit = (task) => {
    const params = new URLSearchParams();

    params.set("id", task._id);

    router.push(
      `/add-task?${params.toString()}`
    );
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* =================================================
          Header
      ================================================= */}

      <Header title="لیست کارها" />

      {/* =================================================
          تاریخ امروز
      ================================================= */}

      <p
        style={{
          fontSize: 11,
          color:
            "var(--text-muted, #cbd5e1)",
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        {getTodayDate()}
      </p>

      {/* =================================================
          Loading
      ================================================= */}

      {loading && (
        <p
          style={{
            textAlign: "center",
            color:
              "var(--text-muted, #94a3b8)",
            fontSize: 13,
            marginTop: 30,
          }}
        >
          در حال دریافت کارها...
        </p>
      )}

      {/* =================================================
          Empty
      ================================================= */}

      {!loading &&
        tasks.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color:
                "var(--text-muted, #94a3b8)",
              fontSize: 13,
              marginTop: 30,
            }}
          >
            {categoryId
              ? "در این دسته‌بندی کاری وجود ندارد."
              : "هیچ کاری وجود ندارد."}
          </p>
        )}

      {/* =================================================
          Task List
      ================================================= */}

      {!loading &&
        tasks.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: "100%",
            }}
          >
            {tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  background:
                    "var(--bg-secondary, #171f33)",

                  padding:
                    "12px 14px",

                  borderRadius: 12,

                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems: "center",

                  gap: 10,

                  width: "100%",

                  boxSizing: "border-box",

                  border:
                    "1px solid var(--border-color, #2e3a59)",
                }}
              >
                {/* =====================================
                    سمت چپ
                ====================================== */}

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",

                    gap: 10,

                    flex: 1,

                    minWidth: 0,
                  }}
                >
                  {/* Checkbox */}

                  <input
                    type="checkbox"
                    checked={Boolean(
                      task.isCompleted
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        task
                      )
                    }
                    style={{
                      accentColor:
                        "var(--accent-blue)",

                      width: 16,

                      height: 16,

                      cursor: "pointer",

                      flexShrink: 0,
                    }}
                  />

                  {/* Task name */}

                  <span
                    style={{
                      fontSize: 13,

                      color:
                        task.isCompleted
                          ? "var(--text-muted, #94a3b8)"
                          : "#ffffff",

                      textDecoration:
                        task.isCompleted
                          ? "line-through"
                          : "none",

                      opacity:
                        task.isCompleted
                          ? 0.6
                          : 1,

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {task.name}
                  </span>
                </div>

                {/* =====================================
                    سمت راست
                ====================================== */}

                <div
                  style={{
                    display: "flex",

                    alignItems:
                      "center",

                    gap: 8,

                    flexShrink: 0,
                  }}
                >
                  {/* Category */}

                  <span
                    style={{
                      fontSize: 9,

                      fontWeight: 700,

                      background:
                        getCategoryColor(
                          task.category
                        ),

                      padding:
                        "3px 7px",

                      borderRadius: 4,

                      color: "#ffffff",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {getCategoryLabel(
                      task.category
                    )}
                  </span>

                  {/* Edit */}

                  <button
                    onClick={() =>
                      handleEdit(task)
                    }
                    title="ویرایش"
                    type="button"
                    style={{
                      background:
                        "none",

                      border: "none",

                      color:
                        "#94a3b8",

                      cursor:
                        "pointer",

                      fontSize: 14,

                      padding: 2,
                    }}
                  >
                    ✏️
                  </button>

                  {/* Delete */}

                  <button
                    onClick={() =>
                      handleDelete(
                        task._id
                      )
                    }
                    title="حذف"
                    type="button"
                    style={{
                      background:
                        "none",

                      border: "none",

                      color:
                        "#ef4444",

                      cursor:
                        "pointer",

                      fontSize: 14,

                      padding: 2,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}