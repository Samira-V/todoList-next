
import { cookies } from 'next/headers';

import Link from 'next/link';
import { MobileFrame } from '@/components/ui/MobileFrame/MobileFrame';
import { Button } from '@/components/ui/Button/Button';
import { verifyToken } from '@/utils/auth';
import { redirect } from 'next/navigation';


export default async function HomePage() {
const cookieStore = await cookies();         
  const token = cookieStore.get("token")?.value;

const tokenPayload = verifyToken(token)
if(!tokenPayload){
redirect("/login")
}

redirect("/tasks")
  return (
    <MobileFrame>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: '20px 0',
          textAlign: 'center',
        }}
      >
        {/* بخش لوگو و توضیحات اولیه (Welcome) */}
        <div style={{ marginTop: '40px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: 'var(--accent-blue, #2563eb)',
              borderRadius: 24,
              margin: '0 auto 24px',
              display: 'grid',
              placeItems: 'center',
              fontSize: 36,
              color: '#ffffff',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
            }}
          >
            ✓
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Welcome to Program
          </h1>

          <p
            style={{
              color: 'var(--text-muted, #94a3b8)',
              fontSize: 13,
              lineHeight: '1.6',
              padding: '0 10px',
            }}
          >
            To do list that will help you plan your day and improve your productivity.
          </p>
        </div>

        {/* دکمه‌های هدایت به صفحات لاگین و ثبت‌نام */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Sign up</Button>
          </Link>

          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button variant="outline">Sign in</Button>
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}