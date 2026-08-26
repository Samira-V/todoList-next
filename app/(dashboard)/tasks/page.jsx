// app/(dashboard)/tasks/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTodayDate } from '@/utils/auth';
import Header from '@/components/ui/Header/Header';
import { useTodos } from '@/hooks/useTasks';
import { getCategoryColor, getCategoryLabel } from '@/utils/category';

export default function TasksPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
   const { updateTodo  } = useTodos();

  useEffect(() => {
    async function loadData() {
      try {
        // ۱. دریافت دسته‌بندی‌ها
        const catRes = await fetch("/api/categories");
        const catResult = await catRes.json();
        if (catRes.ok) setCategories(catResult.data);

        // ۲. دریافت تسک‌های کاربر از API جدیدی که ساختیم
        const taskRes = await fetch("/api/tasks");
        const taskResult = await taskRes.json();

        if (taskRes.status === 401) {
          // اگر کاربر لاگین نبود، بفرستش به لاگین
          router.push("/login");
          return;
        }

        if (taskRes.ok) {
          setTasks(taskResult.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>در حال بارگذاری...</div>;
  }
const sortedTodos = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// گرفتن دو تای اول (که جدیدترین‌ها هستند)
const lastTwoTodos = sortedTodos.slice(0, 2);


  return (
    <div style={{ padding: '20px' }}>
      <Header title={"تسک‌های من"} />

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {categories.map((cat) => (
          <Link key={cat._id} href={`/task-list?category=${cat._id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: cat.color, borderRadius: 12, padding: 14, color: '#fff' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>• {cat.title}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{cat.count}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Tasks List */}
      <div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>{getTodayDate()}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks?.length > 0 ? (
            lastTwoTodos?.map((task) => (
              <div 
                key={task._id} 
                style={{ 
                  background: '#171f33', 
                  padding: '12px 14px', 
                  borderRadius: 10, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  border: '1px solid #2e3a59' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox"  onChange={() => updateTodo (task._id, task.isCompleted)}  />
                  <span style={{ 
                    fontSize: 13, 
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    opacity: task.isCompleted ? 0.6 : 1 
                  }}>
                    {task.name}
                  </span>
                </div>
                {/* اگر تسک دسته‌بندی خاصی دارد اینجا نمایش دهید */}
                <span style={{ fontSize: 9, background: getCategoryColor(task.category), padding: '2px 6px', borderRadius: 4, color: '#fff' }}>
                 {getCategoryLabel(task.category)}
                </span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 13, color: '#64748b' }}>هیچ تسکی پیدا نشد.</p>
          )}
        </div>
      </div>
    </div>
  );
}
