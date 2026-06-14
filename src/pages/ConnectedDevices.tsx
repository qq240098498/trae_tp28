import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, AlertTriangle, CheckCircle, Smartphone, Monitor, Home, Tablet, Tv, Watch, Plug, Settings, Cpu, Minus, PieChart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/StatCard';
import type { ConnectedDeviceRecord, ConnectedDeviceRecordFormData, RouterCapacityConfig, RouterCapacityConfigFormData, ConnectedDeviceCategory } from '@/types';
import { connectedDeviceCategoryLabels, connectedDeviceCategoryIcons } from '@/types';

const categoryIcons: Record<ConnectedDeviceCategory, typeof Smartphone> = {
  phone: Smartphone,
  computer: Monitor,
  smarthome: Home,
  tablet: Tablet,
  tv: Tv,
  wearable: Watch,
  other: Plug,
};

const categoryColorClasses: Record<ConnectedDeviceCategory, string> = {
  phone: 'bg-teal-500/10 text-teal-400',
  computer: 'bg-violet-500/10 text-violet-400',
  smarthome: 'bg-emerald-500/10 text-emerald-400',
  tablet: 'bg-teal-500/10 text-teal-400',
  tv: 'bg-amber-500/10 text-amber-400',
  wearable: 'bg-violet-500/10 text-violet-400',
  other: 'bg-amber-500/10 text-amber-400',
};

const inputClass = 'w-full px-3 py-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-teal/40 focus:ring-1 focus:ring-accent-teal/20 transition-all';
const labelClass = 'block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider';

export function ConnectedDevices() {
  const connectedDevices = useStore(state => state.connectedDevices);
  const routerCapacityConfigs = useStore(state => state.routerCapacityConfigs);
  const addConnectedDevice = useStore(state => state.addConnectedDevice);
  const updateConnectedDevice = useStore(state => state.updateConnectedDevice);
  const deleteConnectedDevice = useStore(state => state.deleteConnectedDevice);
  const addRouterCapacity = useStore(state => state.addRouterCapacity);
  const updateRouterCapacity = useStore(state => state.updateRouterCapacity);
  const deleteRouterCapacity = useStore(state => state.deleteRouterCapacity);
  const wifis = useStore(state => state.wifis);

  const [isDeviceFormOpen, setIsDeviceFormOpen] = useState(false);
  const [isCapacityFormOpen, setIsCapacityFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<ConnectedDeviceRecord | null>(null);
  const [editingCapacity, setEditingCapacity] = useState<RouterCapacityConfig | null>(null);

  const [formCategory, setFormCategory] = useState<ConnectedDeviceCategory>('phone');
  const [formName, setFormName] = useState('');
  const [formCount, setFormCount] = useState(1);
  const [formWifiId, setFormWifiId] = useState<string | undefined>(undefined);
  const [formNotes, setFormNotes] = useState('');

  const [capacityName, setCapacityName] = useState('');
  const [capacityMaxDevices, setCapacityMaxDevices] = useState(30);
  const [capacityWifiId, setCapacityWifiId] = useState<string | undefined>(undefined);
  const [capacityNotes, setCapacityNotes] = useState('');

  const totalDevices = useMemo(() => {
    return connectedDevices.reduce((sum, d) => sum + d.count, 0);
  }, [connectedDevices]);

  const categoryStats = useMemo(() => {
    const stats: Record<ConnectedDeviceCategory, number> = {
      phone: 0, computer: 0, smarthome: 0, tablet: 0, tv: 0, wearable: 0, other: 0,
    };
    connectedDevices.forEach(d => {
      stats[d.category] += d.count;
    });
    return stats;
  }, [connectedDevices]);

  const totalRouterCapacity = useMemo(() => {
    if (routerCapacityConfigs.length === 0) return 0;
    return routerCapacityConfigs.reduce((sum, c) => sum + c.max_devices, 0);
  }, [routerCapacityConfigs]);

  const capacityWarnings = useMemo(() => {
    const warnings: { config: RouterCapacityConfig; used: number; exceeded: boolean }[] = [];
    const hasAnyWifiAssociation = routerCapacityConfigs.some(c => c.wifi_id !== undefined);

    routerCapacityConfigs.forEach(config => {
      let relatedDevices: ConnectedDeviceRecord[];
      if (config.wifi_id) {
        relatedDevices = connectedDevices.filter(d => d.wifi_id === config.wifi_id);
      } else if (hasAnyWifiAssociation) {
        relatedDevices = connectedDevices.filter(d => d.wifi_id === undefined);
      } else {
        relatedDevices = connectedDevices;
      }
      const used = relatedDevices.reduce((sum, d) => sum + d.count, 0);
      warnings.push({
        config,
        used,
        exceeded: used > config.max_devices,
      });
    });
    return warnings;
  }, [routerCapacityConfigs, connectedDevices]);

  const openAddDeviceForm = () => {
    setEditingDevice(null);
    setFormCategory('phone');
    setFormName('');
    setFormCount(1);
    setFormWifiId(undefined);
    setFormNotes('');
    setIsDeviceFormOpen(true);
  };

  const openEditDeviceForm = (device: ConnectedDeviceRecord) => {
    setEditingDevice(device);
    setFormCategory(device.category);
    setFormName(device.name);
    setFormCount(device.count);
    setFormWifiId(device.wifi_id);
    setFormNotes(device.notes || '');
    setIsDeviceFormOpen(true);
  };

  const handleDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('请输入设备名称');
      return;
    }
    if (formCount < 1) {
      alert('设备数量至少为 1');
      return;
    }
    const data: ConnectedDeviceRecordFormData = {
      category: formCategory,
      name: formName.trim(),
      count: formCount,
      wifi_id: formWifiId,
      notes: formNotes.trim() || undefined,
    };
    if (editingDevice) {
      updateConnectedDevice(editingDevice.id, data);
    } else {
      addConnectedDevice(data);
    }
    setIsDeviceFormOpen(false);
    setEditingDevice(null);
  };

  const handleDeleteDevice = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteConnectedDevice(id);
    }
  };

  const openAddCapacityForm = () => {
    setEditingCapacity(null);
    setCapacityName('');
    setCapacityMaxDevices(30);
    setCapacityWifiId(undefined);
    setCapacityNotes('');
    setIsCapacityFormOpen(true);
  };

  const openEditCapacityForm = (config: RouterCapacityConfig) => {
    setEditingCapacity(config);
    setCapacityName(config.name);
    setCapacityMaxDevices(config.max_devices);
    setCapacityWifiId(config.wifi_id);
    setCapacityNotes(config.notes || '');
    setIsCapacityFormOpen(true);
  };

  const handleCapacitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capacityName.trim()) {
      alert('请输入路由器名称');
      return;
    }
    if (capacityMaxDevices < 1) {
      alert('带机量至少为 1');
      return;
    }
    const data: RouterCapacityConfigFormData = {
      name: capacityName.trim(),
      max_devices: capacityMaxDevices,
      wifi_id: capacityWifiId,
      notes: capacityNotes.trim() || undefined,
    };
    if (editingCapacity) {
      updateRouterCapacity(editingCapacity.id, data);
    } else {
      addRouterCapacity(data);
    }
    setIsCapacityFormOpen(false);
    setEditingCapacity(null);
  };

  const handleDeleteCapacity = (id: string) => {
    if (confirm('确定要删除这个路由器配置吗？')) {
      deleteRouterCapacity(id);
    }
  };

  const needUpgrade = totalRouterCapacity > 0 && totalDevices > totalRouterCapacity;
  const nearCapacity = totalRouterCapacity > 0 && totalDevices >= totalRouterCapacity * 0.8 && totalDevices <= totalRouterCapacity;

  const connectedDeviceCategories: ConnectedDeviceCategory[] = ['phone', 'computer', 'smarthome', 'tablet', 'tv', 'wearable', 'other'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight mb-1">
            设备连接状态
          </h1>
          <p className="text-sm text-white/30">记录连接 WiFi 的常用设备，评估路由器带机量</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAddCapacityForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] text-white/70 rounded-lg hover:bg-white/[0.08] hover:text-white transition-all text-sm font-medium border border-white/[0.06]"
          >
            <Settings className="w-4 h-4" />
            路由器配置
          </button>
          <button
            onClick={openAddDeviceForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
          >
            <Plus className="w-4 h-4" />
            添加记录
          </button>
        </div>
      </div>

      {(needUpgrade || nearCapacity) && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          needUpgrade
            ? 'bg-red-500/[0.06] border-red-500/20'
            : 'bg-amber-500/[0.06] border-amber-500/20'
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            needUpgrade ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-bold mb-1 ${
              needUpgrade ? 'text-red-400' : 'text-amber-400'
            }`}>
              {needUpgrade ? '⚠️ 建议升级路由器' : '⚠️ 接近带机上限'}
            </h3>
            <p className={`text-xs ${
              needUpgrade ? 'text-red-400/70' : 'text-amber-400/70'
            }`}>
              当前连接设备总数 <span className="font-semibold">{totalDevices}</span> 台，
              {totalRouterCapacity > 0 ? (
                <>
                  路由器总建议带机量 <span className="font-semibold">{totalRouterCapacity}</span> 台，
                  {needUpgrade
                    ? '已超出建议带机量，可能导致网络卡顿、掉线等问题，建议升级路由器或减少同时连接的设备。'
                    : '已接近容量上限，请注意监控设备连接情况。'}
                </>
              ) : (
                '请先配置路由器建议带机量以获取评估建议。'
              )}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="连接设备总数"
          value={totalDevices}
          icon={Cpu}
          color="teal"
          subtitle={connectedDevices.length > 0 ? `${connectedDevices.length} 条记录` : '暂无记录'}
        />
        <StatCard
          title="手机设备"
          value={categoryStats.phone}
          icon={Smartphone}
          color="teal"
          subtitle={`${categoryStats.phone > 0 ? Math.round(categoryStats.phone / totalDevices * 100) : 0}% 占比`}
        />
        <StatCard
          title="电脑设备"
          value={categoryStats.computer}
          icon={Monitor}
          color="violet"
          subtitle={`${categoryStats.computer > 0 ? Math.round(categoryStats.computer / totalDevices * 100) : 0}% 占比`}
        />
        <StatCard
          title="智能家居"
          value={categoryStats.smarthome}
          icon={Home}
          color="emerald"
          subtitle={`${categoryStats.smarthome > 0 ? Math.round(categoryStats.smarthome / totalDevices * 100) : 0}% 占比`}
        />
      </div>

      {routerCapacityConfigs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-display tracking-tight flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-accent-teal" />
              路由器带机量配置
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {routerCapacityConfigs.map(config => {
              const warning = capacityWarnings.find(w => w.config.id === config.id);
              const used = warning?.used ?? 0;
              const percentage = config.max_devices > 0 ? Math.min((used / config.max_devices) * 100, 100) : 0;
              const isExceeded = warning?.exceeded || used > config.max_devices;
              const relatedWifi = wifis.find(w => w.id === config.wifi_id);
              return (
                <div
                  key={config.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isExceeded
                      ? 'bg-red-500/[0.04] border-red-500/20'
                      : percentage >= 80
                        ? 'bg-amber-500/[0.04] border-amber-500/20'
                        : 'bg-white/[0.01] border-white/[0.06] hover:border-accent-teal/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isExceeded ? 'bg-red-500/10 text-red-400'
                          : percentage >= 80 ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-accent-teal/10 text-accent-teal'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{config.name}</p>
                        <p className="text-[10px] text-white/30">
                          建议带机 {config.max_devices} 台
                          {relatedWifi && ` · ${relatedWifi.ssid}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditCapacityForm(config)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-accent-teal transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCapacity(config.id)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-red-400 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">使用情况</span>
                        <span className={isExceeded ? 'text-red-400 font-semibold' : percentage >= 80 ? 'text-amber-400 font-semibold' : 'text-white/60'}>
                          {used} / {config.max_devices} 台
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isExceeded ? 'bg-gradient-to-r from-red-500 to-red-400'
                              : percentage >= 80 ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                              : 'bg-gradient-to-r from-accent-teal to-cyan-400'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      {isExceeded && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          超出 {used - config.max_devices} 台
                        </div>
                      )}
                    </div>
                  {config.notes && (
                    <p className="text-[10px] text-white/20 mt-2 pt-2 border-t border-white/[0.04]">
                      {config.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-display tracking-tight flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-violet-400" />
            连接记录
          </h2>
          {connectedDevices.length > 0 && (
            <span className="text-[11px] text-white/30">
              共 {connectedDevices.length} 条记录
            </span>
          )}
        </div>

        {connectedDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {connectedDeviceCategories.map(category => {
              const categoryRecords = connectedDevices.filter(d => d.category === category);
              if (categoryRecords.length === 0) return null;
              const categoryTotal = categoryRecords.reduce((sum, d) => sum + d.count, 0);
              const Icon = categoryIcons[category];
              return (
                <div
                  key={category}
                  className="p-4 bg-white/[0.01] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-white/[0.04]">
                    <div className={`p-2 rounded-lg ${categoryColorClasses[category]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <span>{connectedDeviceCategoryIcons[category]}</span>
                        {connectedDeviceCategoryLabels[category]}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {categoryRecords.length} 条记录 · 共 {categoryTotal} 台
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {categoryRecords.map(record => {
                      const relatedWifi = wifis.find(w => w.id === record.wifi_id);
                      return (
                        <div
                          key={record.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-black/10 hover:bg-black/20 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{record.name}</p>
                            {relatedWifi && (
                              <p className="text-[10px] text-white/25 truncate">
                                WiFi: {relatedWifi.ssid}
                              </p>
                            )}
                            {record.notes && !relatedWifi && (
                              <p className="text-[10px] text-white/20 truncate">{record.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 rounded-md bg-accent-teal/10 text-accent-teal text-xs font-semibold">
                              ×{record.count}
                            </span>
                            <button
                              onClick={() => openEditDeviceForm(record)}
                              className="p-1 rounded-md hover:bg-white/[0.06] text-white/20 hover:text-accent-teal transition-colors opacity-0 group-hover:opacity-100"
                              title="编辑"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteDevice(record.id)}
                              className="p-1 rounded-md hover:bg-white/[0.06] text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              title="删除"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/[0.04]">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
              <Cpu className="w-6 h-6 text-white/10" />
            </div>
            <p className="text-sm text-white/30 mb-2">还没有添加任何设备连接记录</p>
            <p className="text-[11px] text-white/20 mb-4">
              记录手机、电脑、智能家居等常用设备，帮助评估路由器负载
            </p>
            <button
              onClick={openAddDeviceForm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-xs font-semibold shadow-lg shadow-accent-teal/20"
            >
              <Plus className="w-3.5 h-3.5" />
              添加第一条记录
            </button>
          </div>
        )}
      </div>

      {isDeviceFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeviceFormOpen(false)} />
          <div className="relative w-full max-w-md bg-base-900 border border-white/[0.08] rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h2 className="text-base font-bold text-white font-display tracking-tight">
                {editingDevice ? '编辑设备记录' : '添加设备记录'}
              </h2>
              <button
                onClick={() => setIsDeviceFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleDeviceSubmit} className="p-5 space-y-4">
              <div>
                <label className={labelClass}>设备类别</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {connectedDeviceCategories.map(cat => {
                    const CatIcon = categoryIcons[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormCategory(cat)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border transition-all ${
                          formCategory === cat
                            ? 'bg-accent-teal/[0.08] border-accent-teal/30 text-accent-teal'
                            : 'bg-black/10 border-white/[0.04] text-white/40 hover:border-white/[0.1] hover:text-white/60'
                        }`}
                      >
                        <CatIcon className="w-4 h-4" />
                        <span className="text-[10px] font-medium">{connectedDeviceCategoryLabels[cat]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelClass}>设备名称</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  placeholder="例如：家人的手机、工作笔记本"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>设备数量</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormCount(Math.max(1, formCount - 1))}
                    className="p-2.5 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={formCount}
                    onChange={e => setFormCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`${inputClass} flex-1 text-center font-semibold text-lg`}
                  />
                  <button
                    type="button"
                    onClick={() => setFormCount(formCount + 1)}
                    className="p-2.5 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {wifis.length > 0 && (
                <div>
                  <label className={labelClass}>关联 WiFi（可选）</label>
                  <select
                    value={formWifiId || ''}
                    onChange={e => setFormWifiId(e.target.value || undefined)}
                    className={inputClass}
                  >
                    <option value="">不关联</option>
                    {wifis.map(w => (
                      <option key={w.id} value={w.id}>{w.ssid} ({w.band === 'dual' ? '双频' : w.band})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>备注（可选）</label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="例如：经常连接、访客设备等"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeviceFormOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] text-white/60 rounded-lg hover:bg-white/[0.08] hover:text-white transition-all text-sm font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
                >
                  {editingDevice ? '保存修改' : '添加记录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCapacityFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCapacityFormOpen(false)} />
          <div className="relative w-full max-w-md bg-base-900 border border-white/[0.08] rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h2 className="text-base font-bold text-white font-display tracking-tight">
                {editingCapacity ? '编辑路由器配置' : '添加路由器配置'}
              </h2>
              <button
                onClick={() => setIsCapacityFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCapacitySubmit} className="p-5 space-y-4">
              <div>
                <label className={labelClass}>路由器名称</label>
                <input
                  type="text"
                  value={capacityName}
                  onChange={e => setCapacityName(e.target.value)}
                  required
                  placeholder="例如：主路由器、客厅路由器"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>建议带机量（台）</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCapacityMaxDevices(Math.max(1, capacityMaxDevices - 5))}
                    className="p-2.5 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    step={5}
                    value={capacityMaxDevices}
                    onChange={e => setCapacityMaxDevices(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`${inputClass} flex-1 text-center font-semibold text-lg`}
                  />
                  <button
                    type="button"
                    onClick={() => setCapacityMaxDevices(capacityMaxDevices + 5)}
                    className="p-2.5 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {[10, 30, 50, 100, 200].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCapacityMaxDevices(v)}
                      className={`flex-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        capacityMaxDevices === v
                          ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/20'
                          : 'bg-white/[0.03] text-white/30 border border-transparent hover:bg-white/[0.06] hover:text-white/50'
                      }`}
                    >
                      {v}台
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-white/20 mt-2">
                  参考：普通家用路由器 20-50 台，中端路由器 50-100 台，企业级路由器 100+ 台
                </p>
              </div>

              {wifis.length > 0 && (
                <div>
                  <label className={labelClass}>关联 WiFi（可选）</label>
                  <select
                    value={capacityWifiId || ''}
                    onChange={e => setCapacityWifiId(e.target.value || undefined)}
                    className={inputClass}
                  >
                    <option value="">不关联</option>
                    {wifis.map(w => (
                      <option key={w.id} value={w.id}>{w.ssid} ({w.band === 'dual' ? '双频' : w.band})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-white/20 mt-1.5">
                    关联后，将只统计连接到该 WiFi 的设备数量
                  </p>
                </div>
              )}

              <div>
                <label className={labelClass}>备注（可选）</label>
                <textarea
                  value={capacityNotes}
                  onChange={e => setCapacityNotes(e.target.value)}
                  rows={2}
                  placeholder="例如：路由器型号、购买时间、摆放位置等"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCapacityFormOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] text-white/60 rounded-lg hover:bg-white/[0.08] hover:text-white transition-all text-sm font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
                >
                  {editingCapacity ? '保存修改' : '添加配置'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
