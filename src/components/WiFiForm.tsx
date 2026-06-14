import { useState, useEffect } from 'react';
import { Wifi, Eye, EyeOff } from 'lucide-react';
import type { WiFiFormData, WiFi, WiFiBand } from '@/types';
import { wifiBandLabels } from '@/types';
import { Modal } from './Modal';
import { useStore } from '@/store/useStore';
import { decrypt } from '@/utils/encryption';

interface WiFiFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WiFiFormData) => void;
  wifi?: WiFi | null;
}

const wifiBands: WiFiBand[] = ['2.4G', '5G', 'dual'];

const initialFormData: WiFiFormData = {
  ssid: '',
  password: '',
  band: 'dual',
  notes: '',
  is_router: false,
  router_ip: '',
  router_password: '',
};

const inputClass = 'w-full px-3 py-2 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-teal/40 focus:ring-1 focus:ring-accent-teal/20 transition-all';
const labelClass = 'block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider';

export function WiFiForm({ isOpen, onClose, onSubmit, wifi }: WiFiFormProps) {
  const encryptionKey = useStore(state => state.encryptionKey);
  const [formData, setFormData] = useState<WiFiFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showRouterPassword, setShowRouterPassword] = useState(false);

  useEffect(() => {
    if (wifi && encryptionKey) {
      const decryptedPassword = decrypt(wifi.password_encrypted, encryptionKey) || '';
      const decryptedRouterPassword = wifi.router_password_encrypted
        ? decrypt(wifi.router_password_encrypted, encryptionKey) || ''
        : '';
      setFormData({
        ssid: wifi.ssid,
        password: decryptedPassword,
        band: wifi.band,
        notes: wifi.notes || '',
        is_router: wifi.is_router,
        router_ip: wifi.router_ip || '',
        router_password: decryptedRouterPassword,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [wifi, isOpen, encryptionKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptionKey) {
      alert('请先在密码中心设置主密码并解锁');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={wifi ? '编辑 WiFi' : '添加 WiFi'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>WiFi 名称 (SSID) *</label>
          <input
            type="text"
            name="ssid"
            value={formData.ssid}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="例如：MyHome_WiFi"
          />
        </div>

        <div>
          <label className={labelClass}>WiFi 密码 *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`${inputClass} pr-10 font-mono`}
              placeholder="输入 WiFi 密码"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>频段</label>
          <div className="grid grid-cols-3 gap-1.5">
            {wifiBands.map(band => (
              <button
                key={band}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, band }))}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  formData.band === band
                    ? band === '2.4G'
                      ? 'bg-amber-500/[0.08] border-amber-500/30 text-amber-400'
                      : band === '5G'
                        ? 'bg-violet-500/[0.08] border-violet-500/30 text-violet-400'
                        : 'bg-accent-teal/[0.08] border-accent-teal/30 text-accent-teal'
                    : 'bg-black/10 border-white/[0.04] text-white/30 hover:border-white/10 hover:text-white/50'
                }`}
              >
                {wifiBandLabels[band]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 bg-black/10 rounded-lg border border-white/[0.04]">
          <input
            type="checkbox"
            id="is_router"
            name="is_router"
            checked={formData.is_router}
            onChange={handleChange}
            className="w-3.5 h-3.5 rounded border-white/20 bg-black/20"
          />
          <label htmlFor="is_router" className="text-xs text-white/50 cursor-pointer">
            这是路由器 WiFi（记录路由器后台登录信息）
          </label>
        </div>

        {formData.is_router && (
          <div className="space-y-3 p-3 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg">
            <div className="flex items-center gap-1.5 text-emerald-400/80">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">路由器后台信息</span>
            </div>
            <div>
              <label className={labelClass}>路由器 IP 地址</label>
              <input
                type="text"
                name="router_ip"
                value={formData.router_ip}
                onChange={handleChange}
                className={`${inputClass} font-mono`}
                placeholder="例如：192.168.1.1"
              />
            </div>
            <div>
              <label className={labelClass}>管理员密码</label>
              <div className="relative">
                <input
                  type={showRouterPassword ? 'text' : 'password'}
                  name="router_password"
                  value={formData.router_password}
                  onChange={handleChange}
                  className={`${inputClass} pr-10 font-mono`}
                  placeholder="路由器后台登录密码"
                />
                <button
                  type="button"
                  onClick={() => setShowRouterPassword(!showRouterPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                >
                  {showRouterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>备注</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="WiFi 的额外信息..."
          />
        </div>

        {!encryptionKey && (
          <div className="p-2.5 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg text-amber-400/80 text-xs">
            需要先在密码中心设置主密码并解锁，才能保存 WiFi 密码
          </div>
        )}

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
            disabled={!encryptionKey}
            className="flex-1 px-4 py-2 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {wifi ? '保存修改' : '添加 WiFi'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
