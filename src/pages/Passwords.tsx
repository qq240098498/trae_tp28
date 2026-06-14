import { useState } from 'react';
import { Lock, Unlock, Key, Wifi, Router as RouterIcon, Shield, Eye, Copy, ExternalLink, EyeOff, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { decrypt, copyToClipboard } from '@/utils/encryption';

export function Passwords() {
  const wifis = useStore(state => state.wifis);
  const masterPasswordSet = useStore(state => state.masterPasswordSet);
  const encryptionKey = useStore(state => state.encryptionKey);
  const setMasterPassword = useStore(state => state.setMasterPassword);
  const unlock = useStore(state => state.unlock);
  const lock = useStore(state => state.lock);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWifiPasswords, setShowWifiPasswords] = useState<Record<string, boolean>>({});
  const [showRouterPasswords, setShowRouterPasswords] = useState<Record<string, boolean>>({});
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const routerWifis = wifis.filter(w => w.is_router);

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      alert('主密码至少需要 4 位');
      return;
    }
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    const success = setMasterPassword(password);
    if (success) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlock(password);
    if (success) {
      setPassword('');
    } else {
      alert('密码错误，请重试');
    }
  };

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItems(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [id]: false }));
      }, 2000);
    }
  };

  const handleOpenRouter = (ip: string) => {
    window.open(`http://${ip}`, '_blank');
  };

  const toggleWifiPassword = (id: string) => {
    setShowWifiPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRouterPassword = (id: string) => {
    setShowRouterPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const inputClass = 'w-full px-3 py-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-teal/40 focus:ring-1 focus:ring-accent-teal/20 transition-all';
  const labelClass = 'block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider';

  if (!masterPasswordSet) {
    return (
      <div className="max-w-sm mx-auto pt-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-accent-teal/10 flex items-center justify-center mx-auto mb-3 border border-emerald-500/15">
            <Shield className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display tracking-tight mb-1">
            设置主密码
          </h1>
          <p className="text-xs text-white/30">主密码用于加密保护您的 WiFi 密码等敏感信息</p>
        </div>

        <form onSubmit={handleSetPassword} className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
          <div>
            <label className={labelClass}>主密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={4}
                className={`${inputClass} pr-10`}
                placeholder="输入主密码"
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
            <label className={labelClass}>确认密码</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={4}
                className={`${inputClass} pr-10`}
                placeholder="再次输入主密码"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg text-amber-400/80 text-[11px]">
            请牢记主密码，如果忘记将无法恢复已保存的密码！
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-all text-sm font-semibold shadow-lg shadow-emerald-500/20"
          >
            设置主密码
          </button>
        </form>
      </div>
    );
  }

  if (!encryptionKey) {
    return (
      <div className="max-w-sm mx-auto pt-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-3 border border-amber-500/15">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display tracking-tight mb-1">
            应用已锁定
          </h1>
          <p className="text-xs text-white/30">请输入主密码解锁以查看敏感信息</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
          <div>
            <label className={labelClass}>主密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={`${inputClass} pr-10`}
                placeholder="输入主密码"
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

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-all text-sm font-semibold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-4 h-4" />
            解锁应用
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight mb-1">
            密码中心
          </h1>
          <p className="text-sm text-white/30">查看和管理所有密码</p>
        </div>
        <button
          onClick={lock}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] text-white/50 rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors text-sm font-medium"
        >
          <Lock className="w-4 h-4" />
          锁定应用
        </button>
      </div>

      <div className="p-3 bg-emerald-500/[0.04] border border-emerald-500/10 rounded-lg flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-emerald-500/10">
          <Unlock className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-emerald-400/80">应用已解锁</p>
          <p className="text-[10px] text-emerald-400/40">您可以查看和管理所有已保存的密码</p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Wifi className="w-4 h-4 text-accent-teal" />
          <h2 className="text-sm font-bold text-white font-display tracking-tight">
            WiFi 密码 ({wifis.length})
          </h2>
        </div>

        {wifis.length > 0 ? (
          <div className="space-y-2">
            {wifis.map(wifi => {
              const decryptedPassword = decrypt(wifi.password_encrypted, encryptionKey);
              return (
                <div
                  key={wifi.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg hover:border-accent-teal/15 transition-all"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="p-1.5 rounded-lg bg-accent-teal/[0.06] text-accent-teal shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{wifi.ssid}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        wifi.band === '2.4G' ? 'bg-amber-500/10 text-amber-400' :
                        wifi.band === '5G' ? 'bg-violet-500/10 text-violet-400' :
                        'bg-accent-teal/10 text-accent-teal'
                      }`}>
                        {wifi.band === 'dual' ? '双频' : wifi.band}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {decryptedPassword && (
                      <>
                        <code className="px-2.5 py-1.5 bg-black/20 rounded-md font-mono text-xs text-white min-w-[100px]">
                          {showWifiPasswords[wifi.id] ? decryptedPassword : '••••••••'}
                        </code>
                        <button
                          onClick={() => toggleWifiPassword(wifi.id)}
                          className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showWifiPasswords[wifi.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(decryptedPassword, `wifi-${wifi.id}`)}
                          className={`p-1.5 rounded-md transition-colors ${
                            copiedItems[`wifi-${wifi.id}`]
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'hover:bg-white/[0.06] text-white/30 hover:text-white/60'
                          }`}
                        >
                          {copiedItems[`wifi-${wifi.id}`] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/[0.01] rounded-xl border border-white/[0.04]">
            <Wifi className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">还没有保存任何 WiFi 密码</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <RouterIcon className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white font-display tracking-tight">
            路由器后台 ({routerWifis.length})
          </h2>
        </div>

        {routerWifis.length > 0 ? (
          <div className="space-y-2">
            {routerWifis.map(wifi => {
              const decryptedRouterPassword = wifi.router_password_encrypted
                ? decrypt(wifi.router_password_encrypted, encryptionKey)
                : null;
              return (
                <div
                  key={wifi.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-3 p-3 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="p-1.5 rounded-lg bg-emerald-500/[0.06] text-emerald-400 shrink-0">
                      <RouterIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{wifi.ssid}</p>
                      {wifi.router_ip && (
                        <button
                          onClick={() => handleOpenRouter(wifi.router_ip!)}
                          className="text-[10px] text-accent-teal/60 hover:text-accent-teal flex items-center gap-0.5"
                        >
                          http://{wifi.router_ip}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {decryptedRouterPassword && (
                    <div className="flex items-center gap-1.5">
                      <code className="px-2.5 py-1.5 bg-black/20 rounded-md font-mono text-xs text-white min-w-[100px]">
                        {showRouterPasswords[wifi.id] ? decryptedRouterPassword : '••••••••'}
                      </code>
                      <button
                        onClick={() => toggleRouterPassword(wifi.id)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showRouterPasswords[wifi.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(decryptedRouterPassword, `router-${wifi.id}`)}
                        className={`p-1.5 rounded-md transition-colors ${
                          copiedItems[`router-${wifi.id}`]
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'hover:bg-white/[0.06] text-white/30 hover:text-white/60'
                        }`}
                      >
                        {copiedItems[`router-${wifi.id}`] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {wifi.router_ip && (
                        <button
                          onClick={() => handleOpenRouter(wifi.router_ip!)}
                          className="p-1.5 rounded-md bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20 transition-colors"
                          title="打开路由器后台"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white/[0.01] rounded-xl border border-white/[0.04]">
            <RouterIcon className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-white/30">还没有保存任何路由器后台密码</p>
            <p className="text-[11px] text-white/15 mt-1">添加 WiFi 时勾选"这是路由器 WiFi"即可记录</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/[0.01] rounded-xl border border-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/[0.04] text-white/20 shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-white/50 mb-1.5">安全说明</h3>
            <ul className="text-[11px] text-white/20 space-y-1">
              <li>• 所有密码使用 AES-256 加密存储，只有输入正确的主密码才能解密</li>
              <li>• 复制到剪贴板的密码会在 30 秒后自动清除</li>
              <li>• 请务必牢记主密码，丢失后无法恢复已保存的密码</li>
              <li>• 建议定期更换主密码以提高安全性</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
