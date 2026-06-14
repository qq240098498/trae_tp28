import { Wifi, Router as RouterIcon, Edit2, Trash2, Eye, Copy, ExternalLink, Check } from 'lucide-react';
import type { WiFi, WiFiBand } from '@/types';
import { wifiBandLabels } from '@/types';
import { useStore } from '@/store/useStore';
import { decrypt, copyToClipboard } from '@/utils/encryption';
import { useState } from 'react';

interface WiFiCardProps {
  wifi: WiFi;
  onEdit: (wifi: WiFi) => void;
  onDelete: (id: string) => void;
  onViewPassword: (wifi: WiFi) => void;
}

const bandStyles: Record<WiFiBand, { bg: string; text: string; border: string }> = {
  '2.4G': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  '5G': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  'dual': { bg: 'bg-gradient-to-r from-amber-500/10 to-violet-500/10', text: 'text-white/70', border: 'border-amber-500/20' },
};

export function WiFiCard({ wifi, onEdit, onDelete, onViewPassword }: WiFiCardProps) {
  const encryptionKey = useStore(state => state.encryptionKey);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const decryptedPassword = encryptionKey ? decrypt(wifi.password_encrypted, encryptionKey) : null;
  const bandStyle = bandStyles[wifi.band];

  const handleCopyPassword = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!decryptedPassword) return;
    const success = await copyToClipboard(decryptedPassword);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenRouter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wifi.router_ip) {
      window.open(`http://${wifi.router_ip}`, '_blank');
    }
  };

  return (
    <div className="group relative rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-accent-teal/20 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-teal/10 text-accent-teal">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">{wifi.ssid}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md border ${bandStyle.bg} ${bandStyle.text} ${bandStyle.border} font-medium`}>
                  {wifiBandLabels[wifi.band]}
                </span>
                {wifi.is_router && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-0.5">
                    <RouterIcon className="w-2.5 h-2.5" />
                    路由器
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onViewPassword(wifi)}
              className="p-1.5 rounded-md hover:bg-accent-teal/10 text-white/30 hover:text-accent-teal transition-colors"
              title="查看密码"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(wifi)}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
              title="编辑"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(wifi.id)}
              className="p-1.5 rounded-md hover:bg-rose-500/20 text-white/30 hover:text-rose-400 transition-colors"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-black/20">
            <span className="text-[11px] text-white/30">密码</span>
            {encryptionKey && decryptedPassword ? (
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs text-white/70">
                  {showPassword ? decryptedPassword : '••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-0.5 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCopyPassword}
                  className={`p-0.5 rounded hover:bg-white/10 transition-colors ${copied ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'}`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-white/20">锁定</span>
            )}
          </div>

          {wifi.is_router && wifi.router_ip && (
            <button
              onClick={handleOpenRouter}
              className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-emerald-400/80">
                <RouterIcon className="w-3 h-3" />
                <span className="text-[11px]">路由器后台</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-emerald-400/60">{wifi.router_ip}</span>
                <ExternalLink className="w-3 h-3 text-emerald-400/40" />
              </div>
            </button>
          )}

          {wifi.notes && (
            <p className="text-[11px] text-white/20 mt-1 pt-1.5 border-t border-white/[0.04]">
              {wifi.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
