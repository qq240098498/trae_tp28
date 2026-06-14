import { useNavigate } from 'react-router-dom';
import { Router, Wifi, Key, Plus, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/StatCard';
import { DeviceCard } from '@/components/DeviceCard';
import type { Device } from '@/types';

export function Dashboard() {
  const navigate = useNavigate();
  const devices = useStore(state => state.devices);
  const wifis = useStore(state => state.wifis);
  const encryptionKey = useStore(state => state.encryptionKey);
  const loadMockData = useStore(state => state.loadMockData);

  const recentDevices = [...devices]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 4);

  const routerCount = devices.filter(d => d.type === 'router').length;
  const wifiWithRouterCount = wifis.filter(w => w.is_router).length;

  const handleEditDevice = (device: Device) => {
    navigate('/devices', { state: { editDevice: device } });
  };

  const handleDeleteDevice = (id: string) => {
    if (confirm('确定要删除这个设备吗？')) {
      useStore.getState().deleteDevice(id);
    }
  };

  const handleLoadDemo = () => {
    if (confirm('加载示例数据将覆盖现有数据，确定继续吗？')) {
      loadMockData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight mb-1">
            网络总览
          </h1>
          <p className="text-sm text-white/30">管理您的家庭网络设备和 WiFi 信息</p>
        </div>
        {devices.length === 0 && wifis.length === 0 && (
          <button
            onClick={handleLoadDemo}
            className="px-3 py-1.5 bg-white/[0.04] text-white/40 rounded-lg hover:bg-white/[0.08] hover:text-white/60 transition-colors text-xs font-medium"
          >
            加载示例数据
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="设备总数"
          value={devices.length}
          icon={Router}
          color="teal"
          subtitle={`${routerCount} 个路由器`}
        />
        <StatCard
          title="WiFi 网络"
          value={wifis.length}
          icon={Wifi}
          color="violet"
          subtitle={`${wifiWithRouterCount} 个关联路由器`}
        />
        <StatCard
          title="已保存密码"
          value={wifis.length + wifiWithRouterCount}
          icon={Key}
          color="emerald"
          subtitle={encryptionKey ? '应用已解锁' : '应用已锁定'}
        />
        <StatCard
          title="最近更新"
          value={devices.length > 0 ? Math.min(devices.length, 5) : 0}
          icon={Clock}
          color="amber"
          subtitle="活动设备"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white font-display tracking-tight">
              最近更新的设备
            </h2>
            <button
              onClick={() => navigate('/devices')}
              className="flex items-center gap-1 text-[11px] text-accent-teal/70 hover:text-accent-teal transition-colors"
            >
              查看全部 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentDevices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentDevices.map((device, i) => (
                <div key={device.id} className={`animate-slide-up stagger-${i + 1}`}>
                  <DeviceCard
                    device={device}
                    onEdit={handleEditDevice}
                    onDelete={handleDeleteDevice}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.01] rounded-xl border border-white/[0.04]">
              <Router className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30 mb-3">还没有添加任何设备</p>
              <button
                onClick={() => navigate('/devices')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-xs font-semibold shadow-lg shadow-accent-teal/20"
              >
                <Plus className="w-3.5 h-3.5" />
                添加第一个设备
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white font-display tracking-tight">
            快捷操作
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/devices')}
              className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-accent-teal/20 rounded-lg transition-all group"
            >
              <div className="p-2 rounded-lg bg-accent-teal/[0.06] text-accent-teal group-hover:bg-accent-teal/10 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-medium text-white/70">添加新设备</p>
                <p className="text-[10px] text-white/25">录入路由器、NAS、摄像头等</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-accent-teal/50 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/wifi')}
              className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-violet-500/20 rounded-lg transition-all group"
            >
              <div className="p-2 rounded-lg bg-violet-500/[0.06] text-violet-400 group-hover:bg-violet-500/10 transition-colors">
                <Wifi className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-medium text-white/70">添加 WiFi</p>
                <p className="text-[10px] text-white/25">记录 SSID 和密码</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-violet-400/50 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/passwords')}
              className="w-full flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-emerald-500/20 rounded-lg transition-all group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/[0.06] text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                <Key className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <p className="text-xs font-medium text-white/70">密码中心</p>
                <p className="text-[10px] text-white/25">查看和管理所有密码</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/10 group-hover:text-emerald-400/50 transition-colors" />
            </button>
          </div>

          <div className="p-3 bg-accent-teal/[0.03] border border-accent-teal/10 rounded-lg">
            <h3 className="text-[11px] font-medium text-accent-teal/80 mb-2">使用提示</h3>
            <ul className="text-[11px] text-white/25 space-y-1">
              <li>• 首次使用请先在密码中心设置主密码</li>
              <li>• WiFi 密码会自动加密存储</li>
              <li>• 复制的密码 30 秒后自动清除</li>
              <li>• 点击路由器 IP 可快速打开后台</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
