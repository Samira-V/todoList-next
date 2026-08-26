'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import Header from '@/components/ui/Header/Header';

import {
  CATEGORY_CONFIG,
} from '@/utils/category';


export default function AddTaskPage() {

  const router =
    useRouter();

  const searchParams =
    useSearchParams();


  const taskId =
    searchParams.get('id');


  const isEditMode =
    Boolean(taskId);


  const [taskData, setTaskData] =
    useState({

      name: '',
      description: '',
      category: 'work',
      date: '',
      time: '',
      isCompleted: false,

    });


  const [loading, setLoading] =
    useState(isEditMode);


  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // GET TASK FOR EDIT
  // ==========================================

  useEffect(() => {

    if (!isEditMode) {
      return;
    }


    const fetchTask = async () => {

      try {

        setLoading(true);


        const res =
          await fetch(
            `/api/tasks/${taskId}`,
            {
              cache: 'no-store',
            }
          );


        const result =
          await res.json();


        if (!res.ok) {

          alert(
            result.error ||
            'خطا در دریافت Task'
          );

          router.replace(
            '/task-list'
          );

          return;
        }


        const task =
          result.data;


        setTaskData({

          name:
            task.name || '',

          description:
            task.description || '',

          category:
            task.category || 'work',

          date:
            task.date || '',

          time:
            task.time || '',

          isCompleted:
            Boolean(task.isCompleted),

        });


      } catch (error) {

        console.error(error);

        alert(
          'خطا در دریافت اطلاعات Task'
        );

      } finally {

        setLoading(false);

      }

    };


    fetchTask();

  }, [
    isEditMode,
    taskId,
    router,
  ]);


  // ==========================================
  // CHANGE INPUT
  // ==========================================

  const updateField = (
    field,
    value
  ) => {

    setTaskData(
      prev => ({
        ...prev,
        [field]: value,
      })
    );

  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!taskData.name.trim()) {

      alert(
        'عنوان کار را وارد کنید'
      );

      return;
    }


    if (!taskData.date) {

      alert(
        'تاریخ را انتخاب کنید'
      );

      return;
    }


    if (!taskData.time) {

      alert(
        'زمان را انتخاب کنید'
      );

      return;
    }


    try {

      setSaving(true);


      const url =
        isEditMode
          ? `/api/tasks/${taskId}`
          : '/api/tasks';


      const method =
        isEditMode
          ? 'PUT'
          : 'POST';


      const res =
        await fetch(
          url,
          {
            method,

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(
                taskData
              ),
          }
        );


      const result =
        await res.json();


      if (!res.ok) {

        alert(
          result.error ||
          'خطا در ذخیره اطلاعات'
        );

        return;
      }


      router.push(
        '/task-list'
      );

      router.refresh();


    } catch (error) {

      console.error(error);

      alert(
        'خطا در ارتباط با سرور'
      );

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (

      <div>

        <Header
          title="ویرایش کار"
        />

        <p
          style={{
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          در حال دریافت اطلاعات...
        </p>

      </div>

    );

  }


  return (

    <div>

      <Header
        title={
          isEditMode
            ? 'ویرایش کار'
            : 'افزودن کار'
        }
      />


      <form
        onSubmit={handleSubmit}
      >

        <Input
          label="عنوان کار"
          value={taskData.name}
          onChange={(e) =>
            updateField(
              'name',
              e.target.value
            )
          }
          required
        />


        <Input
          label="توضیحات"
          value={
            taskData.description
          }
          onChange={(e) =>
            updateField(
              'description',
              e.target.value
            )
          }
        />


        {/* Category */}

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
            انتخاب دسته‌بندی
          </label>


          <select
            value={
              taskData.category
            }

            onChange={(e) =>
              updateField(
                'category',
                e.target.value
              )
            }

            style={{
              width: '100%',
              padding: 12,
              backgroundColor:
                'var(--bg-input, #151c2e)',
              border:
                '1px solid var(--border-color, #2e3a59)',
              borderRadius: 8,
              color: '#fff',
              outline: 'none',
            }}
          >

            {Object.entries(
              CATEGORY_CONFIG
            ).map(
              ([value, config]) => (

                <option
                  key={value}
                  value={value}
                >
                  {config.label}
                </option>

              )
            )}

          </select>

        </div>


        <Input
          label="تاریخ"
          type="date"
          value={taskData.date}
          onChange={(e) =>
            updateField(
              'date',
              e.target.value
            )
          }
        />


        <Input
          label="زمان"
          type="time"
          value={taskData.time}
          onChange={(e) =>
            updateField(
              'time',
              e.target.value
            )
          }
        />


        <Button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 10,
          }}
        >

          {saving
            ? 'در حال ذخیره...'
            : isEditMode
              ? 'ذخیره تغییرات'
              : 'افزودن'}

        </Button>

      </form>

    </div>

  );

}