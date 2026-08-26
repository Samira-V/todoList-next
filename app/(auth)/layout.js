// app/(auth)/layout.jsx
import { MobileFrame } from '@/components/ui/MobileFrame/MobileFrame';

export default function AuthLayout({ children }) {
  return <MobileFrame>{children}</MobileFrame>;
}