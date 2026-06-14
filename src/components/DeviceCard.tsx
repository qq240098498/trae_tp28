import { Router, Network, HardDrive, Speaker, Camera, Monitor, Wifi, MapPin, Edit2, Trash2, Copy, Check } from 'lucide-react';
import type { Device, DeviceType } from '@/types';
import { deviceTypeLabels } from '@/types';
import { copyToClipboard } from '@/utils/encryption';
import { useState } from 'react';

interface DeviceCardProps {
  device: Device;
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
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

const colorMap: Record<DeviceType, { bg: string; border: string; icon: string; dot: string }> = {
  router: { bg: 'from-accent-teal/10 to-cyan-500/5', border: 'hover:border-accent-teal/30', icon: 'bg-accent-teal/10 text-accent-teal', dot: 'bg-accent-teal' },
  switch: { bg: 'from-violet-500/10 to-purple-500/5', border: 'hover:border-violet-500/30', icon: 'bg-violet-500/10 text-violet-400', dot: 'bg-violet-400' },
  nas: { bg: 'from-emerald-500/10 to-green-500/5', border: 'hover:border-emerald-500/30', icon: 'bg-emerald-500/10 text-emerald-400', dot: 'bg-emerald-400' },
  speaker: { bg: 'from-amber-500/10 to-orange-500/5', border: 'hover:border-amber-500/30', icon: 'bg-amber-500/10 text-amber-400', dot: 'bg-amber-400' },
  camera: { bg: 'from-rose-500/10 to-pink-500/5', border: 'hover:border-rose-500/30', icon: 'bg-rose-500/10 text-rose-400', dot: 'bg-rose-400' },
  tvbox: { bg: 'from-sky-500/10 to-blue-500/5', border: 'hover:border-sky-500/30', icon: 'bg-sky-500/10 text-sky-400', dot: 'bg-sky-400' },
  other: { bg: 'from-slate-500/10 to-slate-400/5', border: 'hover:border-slate-500/30', icon: 'bg-slate-500/10 text-slate-400', dot: 'bg-slate-400' },
};

export function DeviceCard({ device, onEdit, onDelete }: DeviceCardProps) {
  const Icon = iconMap[device.type];
  const colors = colorMap[device.type];
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className={`group relative rounded-xl border border-white/[0.06] bg-gradient-to-br ${colors.bg} ${colors.border} transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.icon}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">{device.name}</h3>
              <span className="text-[11px] text-white/30">{deviceTypeLabels[device.type]}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(device)}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
              title="编辑"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(device.id)}
              className="p-1.5 rounded-md hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-colors"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          {device.ip_address && (
            <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-black/20">
              <span className="text-[11px] text-white/30">IP</span>
              <button
                onClick={() => handleCopy(device.ip_address!, 'ip')}
                className="flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-accent-teal transition-colors"
              >
                {device.ip_address}
                {copiedField === 'ip' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}

          {device.mac_address && (
            <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-black/20">
              <span className="text-[11px] text-white/30">MAC</span>
              <button
                onClick={() => handleCopy(device.mac_address!, 'mac')}
                className="flex items-center gap-1.5 font-mono text-[11px] text-white/50 hover:text-accent-teal transition-colors"
              >
                {device.mac_address}
                {copiedField === 'mac' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-white/40 pt-0.5">
            <MapPin className="w-3 h-3" />
            <span className="text-xs">{device.location}</span>
          </div>

          {device.notes && (
            <p className="text-[11px] text-white/20 mt-1 pt-1.5 border-t border-white/[0.04]">
              {device.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
