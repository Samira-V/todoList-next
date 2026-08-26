'use client';

import Header from '@/components/ui/Header/Header';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (isMounted) {
          if (res.ok && data) { 
            setUser(data);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        if (isMounted) setLoading(false);
      }
        const statsRes = await fetch("/api/tasks/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
     
    }

    fetchData(); 


    return () => { isMounted = false };
  }, []); 

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!user) return <div>شما اجازه دسترسی ندارید (لطفاً لاگین کنید).</div>;
 const completedPercent = stats.total > 0 
    ? (stats.completed / stats.total) * 100 
    : 0;

      const pieData = [
    { name: 'انجام شده', value: stats.completed, color: '#10b981' }, // سبز
    { name: 'در انتظار', value: stats.pending, color: '#3b82f6' },  // آبی
  ];
  return (
    <div>
      <Header title={"پروفایل"} />
      
      {/* Avatar & User Details */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--bg-secondary, #171f33)',
            border: '2px solid var(--border-color, #2e3a59)',
            margin: '0 auto 10px',
            display: 'grid',
            placeItems: 'center',
            fontSize: 28,
          }}
        >
          👤
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600 ,color: 'var(--text-muted, #94a3b8)'}}>{user.user.name}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted, #94a3b8)' }}>{user.user.email}</p>
      </div>

      {/* Statistics Card - (بخش آماری شما) */}
      <div className="stats-cards" style={{ display: 'flex', gap: '20px', marginBottom: '30px',alignItems:'center',justifyContent:'center' }}>
        <div className="card" style={{fontSize: 12, color: '#10b981' }}>
          <small>کل کارها</small>
          <h2>{stats.total}</h2>
        </div>
        <div className="card" style={{fontSize: 12, color: '#10b981' }}>
          <small>انجام شده</small>
          <h2>{stats.completed}</h2>
        </div>
        <div className="card" style={{fontSize: 12, color: '#f59e0b' }}>
          <small>در انتظار</small>
          <h2>{stats.pending}</h2>
        </div>
      </div>

     
     {/* --- بخش نمودار دایره‌ای --- */}
<div className="chart-section" style={{ 
  textAlign: 'center', 
  marginTop: '20px', 
  width: '100%', 
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  flexDirection:'column'

}}>
  <h3 style={{ fontSize: 14, color: '#94a3b8', marginBottom: '10px' }}>وضعیت پیشرفت</h3>
  
  {stats.total > 0 ? (
    /* استفاده از کانتینر ریسپانسیو برای کنترل دقیق ابعاد */
    <div style={{ width: '100%', height: 220 }}> 
      <PieChart width={220} height={220}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={70} // کوچک‌تر کردن شعاع برای جلوگیری از اسکرول
          innerRadius={50} // ایجاد حالت Donut (اختیاری: اگر دایره پر می‌خواهید این خط را حذف کنید)
          paddingAngle={5}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
          verticalAlign="bottom" 
          iconSize={12}
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
        />
      </PieChart>
    </div>
  ) : (
    <p style={{ fontSize: 13, color: '#64748b', marginTop: '20px' }}>هنوز تسکی ثبت نشده است.</p>
  )}
</div>

      {/* --- پایان بخش نمودار دایره‌ای --- */}
    </div>
  );
}
   

