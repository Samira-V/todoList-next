'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getTodayDate } from '@/utils/auth';
import Header from '@/components/ui/Header/Header';
import { getCategoryColor, getCategoryLabel } from '@/utils/category';
export default function TaskListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get('category');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت تسک‌ها
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);

        let url = '/api/tasks';

        if (categoryId) {
          url += `?category=${encodeURIComponent(categoryId)}`;
        }

        const res = await fetch(url);
        const result = await res.json();

        if (res.ok) {
          setTasks(result.data || []);
        } else {
          console.error(result.error || 'خطا در دریافت تسک‌ها');
          setTasks([]);
        }
      } catch (error) {
        console.error('Fetch tasks error:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [categoryId]);

  // فیلتر بر اساس دسته‌بندی
  const filteredTasks = categoryId
    ? tasks.filter((task) => task.category === categoryId)
    : tasks;

  // حذف تسک
  const handleDelete = async (taskId) => {
    if (!confirm('آیا از حذف این کار مطمئن هستید؟')) {
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (res.ok) {
        setTasks((prev) =>
          prev.filter((task) => task._id !== taskId)
        );

        alert('کار با موفقیت حذف شد.');
      } else {
        alert(result.error || 'خطا در حذف کار');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('خطا در ارتباط با سرور');
    }
  };

const handleCheckboxChange = async (task) => {

  const newStatus =
    !task.isCompleted;


  // Optimistic UI
  setTasks(prev =>
    prev.map(item =>
      item._id === task._id
        ? {
            ...item,
            isCompleted: newStatus,
          }
        : item
    )
  );


  try {

    const res =
      await fetch(
        `/api/tasks/${task._id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            isCompleted:
              newStatus,
          }),
        }
      );


    if (!res.ok) {

      const result =
        await res.json();


      // Rollback

      setTasks(prev =>
        prev.map(item =>
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
        'خطا در ذخیره وضعیت'
      );

    }

  } catch (error) {

    console.error(error);


    // Rollback

    setTasks(prev =>
      prev.map(item =>
        item._id === task._id
          ? {
              ...item,
              isCompleted:
                !newStatus,
            }
          : item
      )
    );

  }

};

  // انتقال به صفحه ویرایش
  const handleEdit = (task) => {
    // فقط ID ارسال می‌شود
    router.push(`/add-task?id=${task._id}`);
  };


  return (
    <div>
      <Header title="لیست کارها" />

      <p
        style={{
          fontSize: 11,
          color: 'var(--text-muted, #cbd5e1)',
          marginBottom: 12,
          fontWeight: 600,
        }}
      >
        {getTodayDate()}
      </p>

      {/* Loading */}
      {loading ? (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted, #94a3b8)',
            fontSize: 13,
            marginTop: 20,
          }}
        >
          در حال دریافت کارها...
        </p>
      ) : filteredTasks.length === 0 ? (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted, #94a3b8)',
            fontSize: 13,
            marginTop: 20,
          }}
        >
          هیچ کاری وجود ندارد.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                background: 'var(--bg-secondary, #171f33)',
                padding: '12px 14px',
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border:
                  '1px solid var(--border-color, #2e3a59)',
              }}
            >
              {/* Checkbox + Name */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flex: 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(task.isCompleted)}
                  onChange={() => handleCheckboxChange(task)}
                  style={{
                    accentColor: 'var(--accent-blue)',
                    width: 16,
                    height: 16,
                    cursor: 'pointer',
                  }}
                />

                <span
                  style={{
                    fontSize: 13,
                    color: task.isCompleted
                      ? 'var(--text-muted, #94a3b8)'
                      : '#ffffff',
                    textDecoration: task.isCompleted
                      ? 'line-through'
                      : 'none',
                    opacity: task.isCompleted ? 0.6 : 1,
                  }}
                >
                  {task.name}
                </span>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {/* Category */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    background: getCategoryColor(task.category),
                    padding: '3px 6px',
                    borderRadius: 4,
                    color: '#ffffff',
                  }}
                >
                {getCategoryLabel(task.category)}
                </span>

                {/* Edit */}
                <button
                  onClick={() => handleEdit(task)}
                  title="ویرایش"
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: 2,
                  }}
                >
                  ✏️
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(task._id)}
                  title="حذف"
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
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