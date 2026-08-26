'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/ui/Header/Header';
import {
  getCategoryLabel,
  getCategoryColor,
} from '@/utils/category';

export default function CalendarPage() {

  // =====================================================
  // تاریخ امروز سیستم
  // =====================================================

  const today = useMemo(() => {
    const now = new Date();

    // حذف ساعت، دقیقه، ثانیه و میلی‌ثانیه
    // تا مقایسه تاریخ‌ها دقیق‌تر باشد
    now.setHours(0, 0, 0, 0);

    return now;
  }, []);


  // =====================================================
  // تاریخ انتخاب شده
  // در ابتدا = امروز
  // =====================================================

  const [selectedDate, setSelectedDate] = useState(today);


  // =====================================================
  // لیست Task ها
  // =====================================================

  const [tasks, setTasks] = useState([]);


  // =====================================================
  // وضعیت Loading
  // =====================================================

  const [loading, setLoading] = useState(false);


  // =====================================================
  // تبدیل Date به YYYY-MM-DD
  //
  // این مقدار برای دیتابیس استفاده می‌شود.
  //
  // مثال:
  //
  // Date = 2026/08/26
  //
  // نتیجه:
  //
  // 2026-08-26
  // =====================================================

  const formatDateForDB = (date) => {

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };


  // =====================================================
  // تبدیل Date به تاریخ شمسی کامل
  //
  // مثال:
  //
  // چهارشنبه، ۵ شهریور ۱۴۰۵
  //
  // نکته:
  // هیچ Number() استفاده نشده.
  // بنابراین مشکل NaN نداریم.
  // =====================================================

  const formatPersianFullDate = (date) => {

    return new Intl.DateTimeFormat(
      'fa-IR-u-ca-persian',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    ).format(date);

  };


  // =====================================================
  // فقط ماه و سال شمسی
  //
  // مثال:
  //
  // شهریور ۱۴۰۵
  // =====================================================

  const formatPersianMonthYear = (date) => {

    return new Intl.DateTimeFormat(
      'fa-IR-u-ca-persian',
      {
        month: 'long',
        year: 'numeric',
      }
    ).format(date);

  };


  // =====================================================
  // نام روز هفته به شمسی
  //
  // مثال:
  //
  // دوشنبه
  // =====================================================

  const formatPersianWeekday = (date) => {

    return new Intl.DateTimeFormat(
      'fa-IR-u-ca-persian',
      {
        weekday: 'short',
      }
    ).format(date);

  };


  // =====================================================
  // شماره روز به شمسی
  //
  // مثال:
  //
  // ۵
  //
  // مقدار مستقیماً String است.
  // تبدیل Number انجام نمی‌دهیم.
  // =====================================================

  const formatPersianDay = (date) => {

    return new Intl.DateTimeFormat(
      'fa-IR-u-ca-persian',
      {
        day: 'numeric',
      }
    ).format(date);

  };


  // =====================================================
  // شروع هفته
  //
  // JavaScript:
  //
  // Sunday = 0
  // Monday = 1
  // ...
  // Saturday = 6
  //
  // بنابراین اینجا یکشنبه را شروع هفته در نظر می‌گیریم.
  // =====================================================

  const startOfWeek = useMemo(() => {

    const date = new Date(selectedDate);

    date.setHours(0, 0, 0, 0);

    const day = date.getDay();

    date.setDate(
      date.getDate() - day
    );

    return date;

  }, [selectedDate]);


  // =====================================================
  // ساخت 7 روز هفته
  // =====================================================

  const days = useMemo(() => {

    return Array.from(
      { length: 7 },
      (_, index) => {

        const date = new Date(
          startOfWeek
        );

        date.setDate(
          startOfWeek.getDate() + index
        );

        date.setHours(0, 0, 0, 0);

        return {

          // خود Date
          date,

          // تاریخ میلادی برای API
          dbDate:
            formatDateForDB(date),

          // نام روز شمسی
          dayName:
            formatPersianWeekday(date),

          // شماره روز شمسی
          dayNumber:
            formatPersianDay(date),

        };

      }
    );

  }, [startOfWeek]);


  // =====================================================
  // دریافت Task های تاریخ انتخاب شده
  // =====================================================

  useEffect(() => {

    const fetchTasks = async () => {

      try {

        setLoading(true);

        // -------------------------------------------------
        // تاریخ انتخاب شده برای دیتابیس
        //
        // مثلاً:
        //
        // 2026-08-26
        // -------------------------------------------------

      const dbDate =
  formatDateForDB(
    selectedDate
  );

const res =
  await fetch(
    `/api/tasks?date=${dbDate}`,
    {
      cache: 'no-store',
    }
  );

const result =
  await res.json();

if (res.ok) {

  setTasks(
    result.data || []
  );

} else {

  setTasks([]);

}

        if (res.ok) {

          setTasks(
            result.data || []
          );

        } else {

          setTasks([]);

          console.error(
            result.message ||
            result.error ||
            'خطا در دریافت Taskها'
          );

        }

      } catch (error) {

        console.error(
          'Calendar fetch error:',
          error
        );

        setTasks([]);

      } finally {

        setLoading(false);

      }

    };


    fetchTasks();

  }, [selectedDate]);


  // =====================================================
  // Render
  // =====================================================

  return (

    <div     style={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* =================================================
          Header
      ================================================= */}

      <Header title="تقویم" />


      {/* =================================================
          ماه و سال شمسی
      ================================================= */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >

        <span
          style={{
            fontWeight: 600,
            fontSize: 14,
          }}
        >

          {formatPersianMonthYear(
            selectedDate
          )}

        </span>

      </div>


      {/* =================================================
          روزهای هفته
      ================================================= */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 4,
          marginBottom: 20,
        }}
      >

        {days.map((item) => {

          // -----------------------------------------------
          // آیا این روز انتخاب شده؟
          // -----------------------------------------------

          const isSelected =
            formatDateForDB(
              selectedDate
            ) === item.dbDate;


          // -----------------------------------------------
          // آیا این روز امروز است؟
          // -----------------------------------------------

          const isToday =
            formatDateForDB(
              today
            ) === item.dbDate;


          return (

            <div
              key={item.dbDate}

              onClick={() => {

                setSelectedDate(
                  item.date
                );

              }}

              style={{
                flex: 1,

                padding: '10px 4px',

                borderRadius: 10,

                textAlign: 'center',

                cursor: 'pointer',

                background:
                  isSelected
                    ? 'var(--accent-blue, #2563eb)'
                    : 'var(--bg-secondary, #171f33)',

                color: '#fff',

                border:
                  isToday
                    ? '1px solid var(--accent-blue, #2563eb)'
                    : '1px solid transparent',

                transition:
                  'all 0.2s ease',
              }}
            >

              {/* -----------------------------------------
                  نام روز
              ----------------------------------------- */}

              <div
                style={{
                  fontSize: 9,

                  color:
                    isSelected
                      ? '#fff'
                      : 'var(--text-muted, #94a3b8)',
                }}
              >

                {item.dayName}

              </div>


              {/* -----------------------------------------
                  شماره روز شمسی
              ----------------------------------------- */}

              <div
                style={{
                  fontSize: 12,

                  fontWeight: 700,

                  marginTop: 4,
                }}
              >

                {item.dayNumber}

              </div>

            </div>

          );

        })}

      </div>


      {/* =================================================
          تاریخ کامل انتخاب شده
      ================================================= */}

      <p
        style={{
          fontSize: 11,

          color:
            'var(--text-muted, #94a3b8)',

          marginBottom: 12,

          fontWeight: 600,
        }}
      >

        {formatPersianFullDate(
          selectedDate
        )}

      </p>


      {/* =================================================
          Loading
      ================================================= */}

      {loading && (

        <p
          style={{
            textAlign: 'center',

            color:
              'var(--text-muted, #94a3b8)',

            fontSize: 13,

            marginTop: 20,
          }}
        >

          در حال دریافت کارها...

        </p>

      )}


      {/* =================================================
          هیچ کاری وجود ندارد
      ================================================= */}

      {!loading &&
        tasks.length === 0 && (

          <p
            style={{
              textAlign: 'center',

              color:
                'var(--text-muted, #94a3b8)',

              fontSize: 13,

              marginTop: 20,
            }}
          >

            برای این روز کاری وجود ندارد.

          </p>

        )}


      {/* =================================================
          لیست Task ها
      ================================================= */}

      {!loading &&
        tasks.length > 0 && (

          <div
            style={{
              display: 'flex',

              flexDirection: 'column',

              gap: 10,
            }}
          >

            {tasks.map((task) => (

              <div
                key={task._id}

                style={{
                  background:
                    'var(--bg-secondary, #171f33)',

                  padding:
                    '12px 14px',

                  borderRadius: 10,

                  display: 'flex',

                  justifyContent:
                    'space-between',

                  alignItems: 'center',

                  border:
                    '1px solid var(--border-color, #2e3a59)',
                }}
              >

                {/* =======================================
                    Task information
                ======================================= */}

                <div
                  style={{
                    display: 'flex',

                    alignItems: 'center',

                    gap: 10,
                  }}
                >

                  <input
                    type="checkbox"

                    checked={
                      Boolean(
                        task.isCompleted
                      )
                    }

                    readOnly

                    style={{
                      accentColor:
                        'var(--accent-blue)',

                      width: 16,

                      height: 16,
                    }}
                  />


                  <div>

                    {/* نام Task */}

                    <div
                      style={{
                        fontSize: 13,

                        textDecoration:
                          task.isCompleted
                            ? 'line-through'
                            : 'none',

                        opacity:
                          task.isCompleted
                            ? 0.6
                            : 1,
                      }}
                    >

                      {task.name}

                    </div>


                    {/* ساعت */}

                    {task.time && (

                      <div
                        style={{
                          fontSize: 10,

                          color:
                            'var(--text-muted, #94a3b8)',

                          marginTop: 3,
                        }}
                      >

                        {task.time}

                      </div>

                    )}

                  </div>

                </div>


                {/* =======================================
                    Category
                ======================================= */}

                <span
                  style={{
                    fontSize: 9,

                    fontWeight: 700,

                    background:
                      getCategoryColor(
                        task.category
                      ),

                    padding:
                      '3px 7px',

                    borderRadius: 4,

                    color: '#fff',
                  }}
                >

                  {getCategoryLabel(
                    task.category
                  )}

                </span>

              </div>

            ))}

          </div>

        )}

    </div>
  );
}