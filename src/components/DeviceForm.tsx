import { useState, useEffect } from 'react';
import { Router, Network, HardDrive, Speaker, Camera, Monitor, Wifi } from 'lucide-react';
import type { DeviceFormData, Device, DeviceType } from '@/types';
import { deviceTypeLabels } from '@/types';
import { Modal } from './Modal';

interface DeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceFormData) => void;
  device?: Device | null;
}

const iconMap: Record<DeviceType, typeof Router> = {
  router: Router,
  switch: Network,
  nas: HardDrive,
  speaker: Speaker,
  camera: Camera,
  tvbox: Monitor,
  other: Wifi,
};

const deviceTypes: DeviceType[] = ['router', 'switch', 'nas', 'speaker', 'camera', 'tvbox', 'other'];

const initialFormData: DeviceFormData = {
  name: '',
  type: 'router',
  ip_address: '',
  mac_address: '',
  location: '',
  notes: '',
};

const inputClass = 'w-full px-3 py-2 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-teal/40 focus:ring-1 focus:ring-accent-teal/20 transition-all';
const labelClass = 'block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider';

export function DeviceForm({ isOpen, onClose, onSubmit, device }: DeviceFormProps) {
  const [formData, setFormData] = useState<DeviceFormData>(initialFormData);

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        type: device.type,
        ip_address: device.ip_address || '',
        mac_address: device.mac_address || '',
        location: device.location,
        notes: device.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [device, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={device ? '编辑设备' : '添加设备'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>设备类型</label>
          <div className="grid grid-cols-4 gap-1.5">
            {deviceTypes.map(type => {
              const Icon = iconMap[type];
              const isSelected = formData.type === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-accent-teal/[0.08] border-accent-teal/30 text-accent-teal'
                      : 'bg-black/10 border-white/[0.04] text-white/30 hover:border-white/10 hover:text-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] leading-tight">{deviceTypeLabels[type]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelClass}>设备名称 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="例如：主路由器"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>IP 地址</label>
            <input
              type="text"
              name="ip_address"
              value={formData.ip_address}
              onChange={handleChange}
              className={`${inputClass} font-mono`}
              placeholder="192.168.1.1"
            />
          </div>
          <div>
            <label className={labelClass}>MAC 地址</label>
            <input
              type="text"
              name="mac_address"
              value={formData.mac_address}
              onChange={handleChange}
              className={`${inputClass} font-mono`}
              placeholder="AA:BB:CC:DD:EE:FF"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>摆放位置 *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="例如：客厅电视柜"
          />
        </div>

        <div>
          <label className={labelClass}>备注</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="设备的额外信息..."
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/[0.04] text-white/50 rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors text-sm font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
          >
            {device ? '保存修改' : '添加设备'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
