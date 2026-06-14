import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DeviceCard } from '@/components/DeviceCard';
import { DeviceForm } from '@/components/DeviceForm';
import type { Device, DeviceFormData, DeviceType } from '@/types';
import { deviceTypeLabels } from '@/types';

const deviceTypes: (DeviceType | 'all')[] = ['all', 'router', 'switch', 'nas', 'speaker', 'camera', 'tvbox', 'other'];

export function Devices() {
  const location = useLocation();
  const devices = useStore(state => state.devices);
  const addDevice = useStore(state => state.addDevice);
  const updateDevice = useStore(state => state.updateDevice);
  const deleteDevice = useStore(state => state.deleteDevice);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DeviceType | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  useEffect(() => {
    const state = location.state as { editDevice?: Device } | null;
    if (state?.editDevice) {
      setEditingDevice(state.editDevice);
      setIsFormOpen(true);
    }
  }, [location]);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.ip_address && device.ip_address.includes(searchQuery));
    const matchesType = filterType === 'all' || device.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    setEditingDevice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个设备吗？')) {
      deleteDevice(id);
    }
  };

  const handleSubmit = (data: DeviceFormData) => {
    if (editingDevice) {
      updateDevice(editingDevice.id, data);
    } else {
      addDevice(data);
    }
    setIsFormOpen(false);
    setEditingDevice(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight mb-1">
            设备管理
          </h1>
          <p className="text-sm text-white/30">管理家中所有网络设备</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
        >
          <Plus className="w-4 h-4" />
          添加设备
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="搜索设备名称、位置或 IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-teal/40 focus:ring-1 focus:ring-accent-teal/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-white/20 flex-shrink-0" />
          {deviceTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap transition-all font-medium ${
                filterType === type
                  ? 'bg-accent-teal/[0.08] text-accent-teal border border-accent-teal/20'
                  : 'bg-black/10 text-white/25 border border-transparent hover:bg-white/[0.04] hover:text-white/40'
              }`}
            >
              {type === 'all' ? '全部' : deviceTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/[0.04]">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-white/10" />
          </div>
          <p className="text-sm text-white/30 mb-2">
            {devices.length === 0 ? '还没有添加任何设备' : '没有找到匹配的设备'}
          </p>
          {devices.length === 0 && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-xs font-semibold shadow-lg shadow-accent-teal/20 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              添加第一个设备
            </button>
          )}
        </div>
      )}

      <DeviceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDevice(null);
        }}
        onSubmit={handleSubmit}
        device={editingDevice}
      />
    </div>
  );
}
