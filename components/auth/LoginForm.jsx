'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
const router = useRouter()

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'ایمیل معتبر وارد کنید.';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validate()) return;
try{
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(formData)
  });
  console.log(res)
  if(res.ok){
  setFormData({email:'',password:''})
  router.push('/tasks')
  setLoading(true);
  setTimeout(() => {
  setLoading(false);
  alert('ورود با موفقیت انجام شد!');
  }, 1500);
  
  }

}catch(err){
 console.error('خطا:', err.message);

}

  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Sing in</h2>
      </div>

      <form onSubmit={handleSubmit}>
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
          Sing in
        </Button>
      </form>

      <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-muted, #94a3b8)', fontSize: 12 }}>or</div>

      <Button variant="outline" type="button">
        Sing in with Google
      </Button>

      <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: 12, color: 'var(--text-muted, #94a3b8)' }}>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: 'var(--accent-blue, #2563eb)', textDecoration: 'none', fontWeight: 600 }}>
          Create your profile
        </Link>
      </div>
    </div>
  );
};