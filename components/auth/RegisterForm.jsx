'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { useRouter } from 'next/navigation';


export const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
 const router = useRouter()

 const handleSubmit = async (e) => {
  e.preventDefault(); // جلوگیری از رفرش شدن صفحه

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'خطایی در ثبت‌نام رخ داد');
    }

    console.log('موفقیت:', data);
    setFormData({name:"" , email :'',password:''})
    router.push("/tasks")
  
  } catch (error) {
    console.error('خطا:', error.message);
  }
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56,
          height: 56,
          background: 'var(--accent-blue, #2563eb)',
          borderRadius: 16,
          margin: '0 auto 16px',
          display: 'grid',
          placeItems: 'center',
          fontSize: 24
        }}>
          📊
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Sing up</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />

        <Button type="submit" isLoading={loading} style={{ marginTop: 8 }}>
          Sing up
        </Button>
      </form>

      <div style={{ textAlign: 'center', margin: '14px 0', color: 'var(--text-muted, #94a3b8)', fontSize: 12 }}>or</div>

      <Button variant="outline" type="button">
        Sing up with Google
      </Button>

      <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: 12, color: 'var(--text-muted, #94a3b8)' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: 'var(--accent-blue, #2563eb)', textDecoration: 'none', fontWeight: 600 }}>
          Sing in
        </Link>
      </div>
    </div>
  );
};