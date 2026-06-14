import { useState } from 'react';
import { Wifi, Router as RouterIcon, Copy, ExternalLink, Eye, EyeOff, Check } from 'lucide-react';
import type { WiFi } from '@/types';
import { useStore } from '@/store/useStore';
import { decrypt, copyToClipboard } from '@/utils/encryption';
import { Modal } from './Modal';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  wifi: WiFi | null;
}

export function PasswordModal({ isOpen, onClose, wifi }: PasswordModalProps) {
  const encryptionKey = useStore(state => state.encryptionKey);
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [showRouterPassword, setShowRouterPassword] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedRouter, setCopiedRouter] = useState(false);

  if (!wifi) return null;

  const wifiPassword = encryptionKey ? decrypt(wifi.password_encrypted, encryptionKey) : null;
  const routerPassword = encryptionKey && wifi.router_password_encrypted
    ? decrypt(wifi.router_password_encrypted, encryptionKey)
    : null;

  const handleCopyWifi = async () => {
    if (!wifiPassword) return;
    const success = await copyToClipboard(wifiPassword);
    if (success) {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const handleCopyRouter = async () => {
    if (!routerPassword) return;
    const success = await copyToClipboard(routerPassword);
    if (success) {
      setCopiedRouter(true);
      setTimeout(() => setCopiedRouter(false), 2000);
    }
  };

  const handleOpenRouter = () => {
    if (wifi.router_ip) {
      window.open(`http://${wifi.router_ip}`, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="查看密码">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-black/10 rounded-lg">
          <div className="p-2 rounded-lg bg-accent-teal/10 text-accent-teal">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">{wifi.ssid}</h3>
            <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md mt-0.5 ${
              wifi.band === '2.4G' ? 'bg-amber-500/10 text-amber-400' :
              wifi.band === '5G' ? 'bg-violet-500/10 text-violet-400' :
              'bg-accent-teal/10 text-accent-teal'
            }`}>
              {wifi.band === 'dual' ? '双频' : wifi.band}
            </span>
          </div>
        </div>

        <div className="p-3 bg-black/10 rounded-lg border border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-2">
            <Wifi className="w-3.5 h-3.5 text-accent-teal" />
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">WiFi 密码</span>
          </div>
          {encryptionKey && wifiPassword ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-black/20 rounded-lg font-mono text-sm text-white">
                {showWifiPassword ? wifiPassword : '••••••••••••'}
              </code>
              <button
                onClick={() => setShowWifiPassword(!showWifiPassword)}
                className="p-2 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
              >
                {showWifiPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyWifi}
                className={`p-2 rounded-lg transition-colors ${
                  copiedWifi
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20'
                }`}
              >
                {copiedWifi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="px-3 py-2 bg-black/20 rounded-lg text-white/20 text-xs text-center">
              请先解锁应用以查看密码
            </div>
          )}
        </div>

        {wifi.is_router && (
          <div className="p-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg">
            <div className="flex items-center gap-1.5 mb-2">
              <RouterIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-400/80 uppercase tracking-wider">路由器后台</span>
            </div>

            {wifi.router_ip && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 px-3 py-2 bg-black/20 rounded-lg">
                  <span className="text-[10px] text-white/20 block">管理地址</span>
                  <code className="font-mono text-xs text-white">http://{wifi.router_ip}</code>
                </div>
                <button
                  onClick={handleOpenRouter}
                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  title="打开路由器后台"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {encryptionKey && routerPassword ? (
              <div className="space-y-1.5">
                <span className="text-[10px] text-white/20">管理员密码</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-black/20 rounded-lg font-mono text-sm text-white">
                    {showRouterPassword ? routerPassword : '••••••••••••'}
                  </code>
                  <button
                    onClick={() => setShowRouterPassword(!showRouterPassword)}
                    className="p-2 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
                  >
                    {showRouterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleCopyRouter}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedRouter
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20'
                    }`}
                  >
                    {copiedRouter ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : wifi.router_password_encrypted ? (
              <div className="px-3 py-2 bg-black/20 rounded-lg text-white/20 text-xs text-center">
                请先解锁应用以查看密码
              </div>
            ) : null}
          </div>
        )}

        {wifi.notes && (
          <div className="p-3 bg-black/10 rounded-lg">
            <span className="text-[10px] text-white/20 block mb-0.5">备注</span>
            <p className="text-white/40 text-xs">{wifi.notes}</p>
          </div>
        )}

        <div className="text-[10px] text-white/15 text-center">
          复制的密码将在 30 秒后自动从剪贴板清除
        </div>
      </div>
    </Modal>
  );
}
