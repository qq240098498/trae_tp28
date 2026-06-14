import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Router, Wifi, Key, Lock, Unlock, Smartphone } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface SidebarProps {
  onLock?: () => void;
}

export function Sidebar({ onLock }: SidebarProps) {
  const encryptionKey = useStore(state => state.encryptionKey);
  const masterPasswordSet = useStore(state => state.masterPasswordSet);

  const navItems = [
    { to: '/', label: '网络总览', icon: LayoutDashboard },
    { to: '/devices', label: '设备管理', icon: Router },
    { to: '/connected', label: '连接状态', icon: Smartphone },
    { to: '/wifi', label: 'WiFi 管理', icon: Wifi },
    { to: '/passwords', label: '密码中心', icon: Key },
  ];

  return (
    <aside className="w-[260px] bg-base-900/80 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-cyan-500 flex items-center justify-center shadow-lg shadow-accent-teal/20">
            <Router className="w-5 h-5 text-base-950" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-display tracking-tight">
              NetHome
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
              Network Manager
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-accent-teal/[0.08] text-accent-teal'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent-teal" />
                  )}
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="text-[13px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        {masterPasswordSet && (
          <button
            onClick={onLock}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-200"
          >
            {encryptionKey ? (
              <>
                <Unlock className="w-[18px] h-[18px] text-emerald-400" />
                <span className="text-[13px] font-medium text-emerald-400/80">已解锁</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <>
                <Lock className="w-[18px] h-[18px] text-amber-400/60" />
                <span className="text-[13px] font-medium text-amber-400/60">已锁定</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-400/40" />
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
