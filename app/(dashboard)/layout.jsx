import { MobileFrame } from '@/components/ui/MobileFrame/MobileFrame';
import { BottomNav } from '@/components/ui/BottomNav/BottomNav';

export default function DashboardLayout({ children }) {
  return (
    <MobileFrame>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
        {children}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}