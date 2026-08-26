'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import Header from '@/components/ui/Header/Header';


function AddTaskContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams.get('id');

  const isEditMode = Boolean(taskId);

  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    category: 'work',
    date: '',
    time: '',
    isCompleted: false,
  });

  // =========================
  // دریافت Task برای ویرایش
  // =========================

  useEffect(() => {
    if (!isEditMode) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);

        const result = await res.json();

        if (!res.ok) {
          console.error(result.error || 'Task not found');
          return;
        }

        const task = result.data;

        setTaskData({
          name: task.name || '',
          description: task.description || '',
          category: task.category || 'work',
          date: task.date || '',
          time: task.time || '',
          isCompleted: task.isCompleted ?? false,
        });

      } catch (error) {
        console.error(
          'Error fetching task for edit:',
          error
        );
      }
    };

    fetchTask();

  }, [isEditMode, taskId]);


  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditMode
      ? `/api/tasks/${taskId}`
      : '/api/tasks';

    const method = isEditMode
      ? 'PUT'
      : 'POST';

    try {

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.error ||
          result.message ||
          'خطا در انجام عملیات'
        );

        return;
      }

      router.push('/task-list');

    } catch (error) {

      console.error(
        'Submit error:',
        error
      );

      alert(
        'خطا در ارتباط با سرور'
      );
    }
  };


  // =========================
  // Render
  // =========================

  return (
    <div>

      <Header
        title={
          isEditMode
            ? 'ویرایش کار'
            : 'افزودن کار'
        }
      />

      <form onSubmit={handleSubmit}>

        <Input
          label="عنوان کار"
          value={taskData.name}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              name: e.target.value,
            })
          }
          required
        />


        <Input
          label="توضیحات"
          value={taskData.description}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              description: e.target.value,
            })
          }
        />


        <div
          style={{
            marginBottom: 16,
          }}
        >

          <label
            style={{
              fontSize: 12,
              color:
                'var(--text-muted, #cbd5e1)',
              display: 'block',
              marginBottom: 6,
            }}
          >
            انتخاب دسته بندی
          </label>


          <select
            value={taskData.category}
            onChange={(e) =>
              setTaskData({
                ...taskData,
                category: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: 12,
              backgroundColor:
                'var(--bg-input, #151c2e)',
              border:
                '1px solid var(--border-color, #2e3a59)',
              borderRadius: 8,
              color: '#ffffff',
              outline: 'none',
            }}
          >

            <option value="work">
              کاری
            </option>

            <option value="meet">
              ملاقات
            </option>

            <option value="personal">
              شخصی
            </option>

            <option value="home">
              خانه
            </option>

          </select>

        </div>


        <Input
          label="تاریخ"
          type="date"
          value={taskData.date}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              date: e.target.value,
            })
          }
        />


        <Input
          label="زمان"
          type="time"
          value={taskData.time}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              time: e.target.value,
            })
          }
        />


        <Button
          type="submit"
          style={{
            marginTop: 10,
          }}
        >
          {isEditMode
            ? 'ویرایش'
            : 'افزودن'}
        </Button>

      </form>

    </div>
  );
}


// ========================================
// Suspense
// ========================================

export default function AddTaskPage() {

  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: 20,
            textAlign: 'center',
          }}
        >
          در حال بارگذاری...
        </div>
      }
    >
      <AddTaskContent />
    </Suspense>
  );
}