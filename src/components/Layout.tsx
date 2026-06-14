import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useStore } from '@/store/useStore';

interface LayoutProps {
  onLock?: () => void;
}

export function Layout({ onLock }: LayoutProps) {
  const encryptionKey = useStore(state => state.encryptionKey);

  return (
    <div className="min-h-screen bg-base-950 flex">
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Sidebar onLock={onLock} />

      <main className="flex-1 relative z-10 min-w-0">
        <div className="p-6 lg:p-8 max-w-[1400px]">
          <Outlet />
        </div>
      </main>

      {!encryptionKey && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="glass-strong rounded-full px-5 py-2.5 text-amber-300/90 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            应用已锁定，请在密码中心解锁以查看敏感信息
          </div>
        </div>
      )}
    </div>
  );
}
