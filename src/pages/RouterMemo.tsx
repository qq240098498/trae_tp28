import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Copy, Check, ExternalLink, Lock, Unlock, BookOpen, Router as RouterIcon, User, Globe, Shield, Power, Wifi, Key, ArrowRight, Lightbulb, AlertCircle, ChevronRight, ChevronDown, Printer } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { decrypt, copyToClipboard } from '@/utils/encryption';
import type { RouterMemo, RouterMemoFormData, ResetGuideStep } from '@/types';

const inputClass = 'w-full px-3 py-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-teal/40 focus:ring-1 focus:ring-accent-teal/20 transition-all';
const labelClass = 'block text-[11px] font-medium text-white/40 mb-1.5 uppercase tracking-wider';

interface ResetGuideTemplate {
  getSteps: (memo: RouterMemo, decrypted: { adminPassword: string; broadbandPassword: string }) => ResetGuideStep[];
}

const resetGuideTemplate: ResetGuideTemplate = {
  getSteps: (memo, decrypted) => [
    {
      title: '准备工作',
      icon: '📋',
      description: '在开始操作前，请确保您已准备好以下信息，避免操作过程中因信息不全导致无法完成。',
      tips: [
        `路由器管理员地址：${memo.admin_address || '请查看路由器背面标签'}`,
        `管理员用户名：${memo.admin_username || 'admin（默认）'}`,
        `管理员密码：${decrypted.adminPassword || '请查看路由器背面标签，或咨询网络服务商'}`,
        memo.broadband_account ? `宽带账号：${memo.broadband_account}` : '宽带账号：请咨询您的网络运营商（如电信、联通、移动）',
        memo.broadband_account && decrypted.broadbandPassword ? `宽带密码：${decrypted.broadbandPassword}` : '宽带密码：请咨询您的网络运营商',
        '确保电脑或手机已连接到该路由器的 WiFi 网络',
      ]
    },
    {
      title: '如何登录路由器后台',
      icon: '🔐',
      description: '通过浏览器访问路由器管理界面，进行各项配置操作。',
      tips: [
        '1. 打开电脑或手机上的浏览器（推荐 Chrome、Edge、Safari）',
        `2. 在地址栏输入：${memo.admin_address || 'http://192.168.1.1 或 http://192.168.0.1'} 然后按回车`,
        `3. 在登录页面输入用户名：${memo.admin_username || 'admin'}`,
        `4. 输入管理员密码：${decrypted.adminPassword || '请查看路由器背面标签'}`,
        '5. 点击"登录"或"确定"按钮进入管理界面',
        '⚠️ 如果无法打开页面，请确认您的设备已连接到该路由器的 WiFi，且地址输入正确',
      ]
    },
    {
      title: '如何修改 WiFi 密码',
      icon: '📶',
      description: '定期更换 WiFi 密码可以有效防止他人蹭网，保护网络安全。',
      tips: [
        '1. 登录路由器后台管理界面',
        '2. 找到"无线设置"、"WiFi 设置"或"Wireless Settings"菜单项',
        '3. 在"无线名称（SSID）"处可修改 WiFi 名称（建议使用英文和数字）',
        '4. 在"无线密码"、"WPA 密钥"或"Password"处输入新密码',
        '5. 密码建议：8-16位，包含大小写字母、数字和符号的组合',
        '6. 点击"保存"或"应用"按钮',
        '7. 保存后，所有已连接的设备会断开，需要使用新密码重新连接',
      ]
    },
    {
      title: '如何重启路由器',
      icon: '🔄',
      description: '当网络出现卡顿、断连等异常时，重启路由器通常可以解决问题。',
      tips: [
        '方法一：通过管理界面重启（推荐）',
        '   1. 登录路由器后台',
        '   2. 找到"系统工具"、"系统设置"或"System Tools"',
        '   3. 选择"重启路由器"或"Reboot"选项',
        '   4. 点击确认，等待约 1-3 分钟自动重启完成',
        '',
        '方法二：物理断电重启',
        '   1. 找到路由器的电源适配器',
        '   2. 拔掉电源插头，等待 30 秒',
        '   3. 重新插上电源',
        '   4. 等待指示灯从闪烁变为稳定（约 2-5 分钟）',
        '⚠️ 重启过程中请勿断电，否则可能损坏路由器',
      ]
    },
    {
      title: '如何恢复出厂设置',
      icon: '⚠️',
      description: '当忘记管理员密码或配置严重出错时，可将路由器恢复到出厂状态。',
      tips: [
        '⚠️ 重要提示：恢复出厂设置将清除所有配置，包括 WiFi 名称、密码、宽带账号等！',
        '',
        '1. 确保路由器处于通电状态',
        '2. 找到路由器背面或侧面的"Reset"复位按钮（通常是一个小孔）',
        '3. 使用牙签、回形针等细物按住按钮',
        '4. 长按约 8-10 秒，直到所有指示灯同时闪烁后松开',
        '5. 等待路由器自动重启（约 2-5 分钟）',
        '6. 重启后，使用默认管理员账号密码登录（通常印在路由器背面）',
        '7. 按照路由器首次使用向导重新配置宽带账号和 WiFi',
      ]
    },
    {
      title: '重新配置宽带连接',
      icon: '🌐',
      description: '恢复出厂设置或更换路由器后，需要重新配置宽带拨号才能上网。',
      tips: [
        '1. 登录路由器后台',
        '2. 找到"上网设置"、"WAN 设置"或"Internet Settings"',
        '3. 上网方式选择"宽带拨号"、"PPPoE"或"ADSL拨号"',
        memo.broadband_account ? `4. 输入宽带账号：${memo.broadband_account}` : '4. 输入宽带账号：请咨询您的网络运营商',
        memo.broadband_account && decrypted.broadbandPassword ? `5. 输入宽带密码：${decrypted.broadbandPassword}` : '5. 输入宽带密码：请咨询您的网络运营商',
        '6. 点击"连接"或"保存"按钮',
        '7. 等待约 30-60 秒，查看是否显示"已连接"状态',
        '8. 如无法连接，请检查账号密码是否正确，或联系运营商客服',
      ]
    },
    {
      title: '常见问题排查',
      icon: '💡',
      description: '网络出现问题时，可以按以下步骤逐一排查。',
      tips: [
        '问题一：所有设备都无法上网',
        '   → 检查光猫和路由器指示灯是否正常',
        '   → 拔掉光猫和路由器电源，等待 30 秒后重新插上',
        '   → 登录后台查看 WAN 口是否已连接',
        '',
        '问题二：能连 WiFi 但不能上网',
        '   → 尝试访问其他网站，排除目标网站问题',
        '   → 检查是否宽带欠费',
        '   → 重启路由器和光猫',
        '',
        '问题三：WiFi 信号弱或经常掉线',
        '   → 将路由器摆放在家中中心位置，避开墙角和金属物品',
        '   → 远离微波炉、蓝牙设备等干扰源',
        '   → 调整路由器天线方向',
        '   → 在后台切换 WiFi 信道',
        '',
        '问题四：忘记管理员密码',
        '   → 尝试使用路由器背面的默认密码',
        '   → 如已修改过且忘记，需要恢复出厂设置（见前文）',
      ]
    },
  ]
};

export function RouterMemo() {
  const routerMemos = useStore(state => state.routerMemos);
  const wifis = useStore(state => state.wifis);
  const encryptionKey = useStore(state => state.encryptionKey);
  const masterPasswordSet = useStore(state => state.masterPasswordSet);
  const unlock = useStore(state => state.unlock);
  const lock = useStore(state => state.lock);
  const setMasterPassword = useStore(state => state.setMasterPassword);
  const addRouterMemo = useStore(state => state.addRouterMemo);
  const updateRouterMemo = useStore(state => state.updateRouterMemo);
  const deleteRouterMemo = useStore(state => state.deleteRouterMemo);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState<RouterMemo | null>(null);
  const [showGuideId, setShowGuideId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  const [formRouterName, setFormRouterName] = useState('');
  const [formAdminAddress, setFormAdminAddress] = useState('192.168.1.1');
  const [formAdminUsername, setFormAdminUsername] = useState('');
  const [formAdminPassword, setFormAdminPassword] = useState('');
  const [formBroadbandAccount, setFormBroadbandAccount] = useState('');
  const [formBroadbandPassword, setFormBroadbandPassword] = useState('');
  const [formWifiId, setFormWifiId] = useState<string | undefined>(undefined);
  const [formModel, setFormModel] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [showFormPasswords, setShowFormPasswords] = useState({ admin: false, broadband: false });

  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
  const [showNewMasterPassword, setShowNewMasterPassword] = useState(false);
  const [showConfirmMasterPassword, setShowConfirmMasterPassword] = useState(false);

  const openAddForm = () => {
    setEditingMemo(null);
    setFormRouterName('');
    setFormAdminAddress('192.168.1.1');
    setFormAdminUsername('');
    setFormAdminPassword('');
    setFormBroadbandAccount('');
    setFormBroadbandPassword('');
    setFormWifiId(undefined);
    setFormModel('');
    setFormLocation('');
    setFormNotes('');
    setShowFormPasswords({ admin: false, broadband: false });
    setIsFormOpen(true);
  };

  const openEditForm = (memo: RouterMemo) => {
    setEditingMemo(memo);
    setFormRouterName(memo.router_name);
    setFormAdminAddress(memo.admin_address);
    setFormAdminUsername(memo.admin_username || '');
    const decryptedAdmin = memo.admin_password_encrypted && encryptionKey
      ? decrypt(memo.admin_password_encrypted, encryptionKey)
      : '';
    setFormAdminPassword(decryptedAdmin || '');
    setFormBroadbandAccount(memo.broadband_account || '');
    const decryptedBroadband = memo.broadband_password_encrypted && encryptionKey
      ? decrypt(memo.broadband_password_encrypted, encryptionKey)
      : '';
    setFormBroadbandPassword(decryptedBroadband || '');
    setFormWifiId(memo.wifi_id);
    setFormModel(memo.model || '');
    setFormLocation(memo.location || '');
    setFormNotes(memo.notes || '');
    setShowFormPasswords({ admin: false, broadband: false });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRouterName.trim()) {
      alert('请输入路由器名称');
      return;
    }
    if (!formAdminAddress.trim()) {
      alert('请输入管理员地址');
      return;
    }
    if (!formAdminPassword) {
      alert('请输入管理员密码');
      return;
    }
    const data: RouterMemoFormData = {
      router_name: formRouterName.trim(),
      admin_address: formAdminAddress.trim(),
      admin_username: formAdminUsername.trim() || undefined,
      admin_password: formAdminPassword,
      broadband_account: formBroadbandAccount.trim() || undefined,
      broadband_password: formBroadbandPassword || undefined,
      wifi_id: formWifiId,
      model: formModel.trim() || undefined,
      location: formLocation.trim() || undefined,
      notes: formNotes.trim() || undefined,
    };
    const success = editingMemo
      ? updateRouterMemo(editingMemo.id, data)
      : addRouterMemo(data);
    if (success) {
      setIsFormOpen(false);
      setEditingMemo(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个路由器备忘录吗？删除后无法恢复。')) {
      deleteRouterMemo(id);
      if (showGuideId === id) {
        setShowGuideId(null);
      }
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

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGuide = (id: string) => {
    setShowGuideId(showGuideId === id ? null : id);
  };

  const getDecryptedPasswords = (memo: RouterMemo) => {
    if (!encryptionKey) return { adminPassword: '', broadbandPassword: '' };
    return {
      adminPassword: decrypt(memo.admin_password_encrypted, encryptionKey) || '',
      broadbandPassword: memo.broadband_password_encrypted
        ? decrypt(memo.broadband_password_encrypted, encryptionKey) || ''
        : '',
    };
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlock(unlockPassword);
    if (success) {
      setUnlockPassword('');
    } else {
      alert('密码错误，请重试');
    }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMasterPassword.length < 4) {
      alert('主密码至少需要 4 位');
      return;
    }
    if (newMasterPassword !== confirmMasterPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    const success = setMasterPassword(newMasterPassword);
    if (success) {
      setNewMasterPassword('');
      setConfirmMasterPassword('');
    }
  };

  const handlePrint = (memo: RouterMemo) => {
    const decrypted = getDecryptedPasswords(memo);
    const steps = resetGuideTemplate.getSteps(memo, decrypted);
    const printContent = `
      <html>
        <head>
          <title>${memo.router_name} - 路由器重置指南</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; color: #333; }
            h1 { color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 10px; }
            h2 { color: #1f2937; margin-top: 24px; background: #f0fdfa; padding: 10px 14px; border-radius: 6px; }
            .info-box { background: #f8fafc; border-left: 4px solid #0d9488; padding: 14px 18px; margin: 14px 0; border-radius: 0 6px 6px 0; }
            .info-box p { margin: 6px 0; font-size: 14px; }
            .step-box { background: #fff; border: 1px solid #e2e8f0; padding: 16px 20px; margin: 12px 0; border-radius: 8px; }
            .step-icon { font-size: 24px; }
            .step-title { font-size: 17px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .step-desc { color: #475569; font-size: 14px; margin-bottom: 10px; }
            .tips { margin: 0; padding-left: 0; list-style: none; }
            .tips li { padding: 4px 0; font-size: 13px; color: #334155; white-space: pre-wrap; font-family: Menlo, Consolas, monospace; }
            .warning { color: #dc2626; font-weight: 600; }
            .footer { margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${memo.router_name} - 路由器重置指南</h1>
          <div class="info-box">
            <p><strong>路由器型号：</strong>${memo.model || '未填写'}</p>
            <p><strong>摆放位置：</strong>${memo.location || '未填写'}</p>
            <p><strong>管理员地址：</strong>http://${memo.admin_address}</p>
            <p><strong>管理员用户名：</strong>${memo.admin_username || 'admin'}</p>
            <p><strong>管理员密码：</strong>${decrypted.adminPassword || '未填写'}</p>
            ${memo.broadband_account ? `<p><strong>宽带账号：</strong>${memo.broadband_account}</p>` : ''}
            ${decrypted.broadbandPassword ? `<p><strong>宽带密码：</strong>${decrypted.broadbandPassword}</p>` : ''}
          </div>
          ${steps.map((step, idx) => `
            <div class="step-box">
              <div class="step-title">
                <span class="step-icon">${step.icon}</span>
                步骤 ${idx + 1}：${step.title}
              </div>
              <p class="step-desc">${step.description}</p>
              <ul class="tips">
                ${step.tips?.map(tip => `<li class="${tip.includes('⚠️') ? 'warning' : ''}">${tip}</li>`).join('') || ''}
              </ul>
            </div>
          `).join('')}
          <div class="footer">
            本指南由 NetHome 路由器备忘录自动生成 · 打印时间：${new Date().toLocaleString('zh-CN')}
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  };

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
          <p className="text-xs text-white/30">路由器备忘录中的密码信息需要加密保护</p>
        </div>

        <form onSubmit={handleSetPassword} className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
          <div>
            <label className={labelClass}>主密码</label>
            <div className="relative">
              <input
                type={showNewMasterPassword ? 'text' : 'password'}
                value={newMasterPassword}
                onChange={e => setNewMasterPassword(e.target.value)}
                required
                minLength={4}
                className={`${inputClass} pr-10`}
                placeholder="输入主密码"
              />
              <button
                type="button"
                onClick={() => setShowNewMasterPassword(!showNewMasterPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
              >
                {showNewMasterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>确认密码</label>
            <div className="relative">
              <input
                type={showConfirmMasterPassword ? 'text' : 'password'}
                value={confirmMasterPassword}
                onChange={e => setConfirmMasterPassword(e.target.value)}
                required
                minLength={4}
                className={`${inputClass} pr-10`}
                placeholder="再次输入主密码"
              />
              <button
                type="button"
                onClick={() => setShowConfirmMasterPassword(!showConfirmMasterPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
              >
                {showConfirmMasterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
          <p className="text-xs text-white/30">请输入主密码解锁以查看路由器备忘录</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
          <div>
            <label className={labelClass}>主密码</label>
            <div className="relative">
              <input
                type={showUnlockPassword ? 'text' : 'password'}
                value={unlockPassword}
                onChange={e => setUnlockPassword(e.target.value)}
                required
                className={`${inputClass} pr-10`}
                placeholder="输入主密码"
              />
              <button
                type="button"
                onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
              >
                {showUnlockPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
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
            路由器备忘录
          </h1>
          <p className="text-sm text-white/30">记录路由器管理信息，一键生成家人可读的操作指南</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={lock}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] text-white/50 rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors text-sm font-medium"
          >
            <Lock className="w-4 h-4" />
            锁定应用
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
          >
            <Plus className="w-4 h-4" />
            添加备忘录
          </button>
        </div>
      </div>

      <div className="p-3 bg-accent-teal/[0.04] border border-accent-teal/10 rounded-lg flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-accent-teal/10">
          <BookOpen className="w-4 h-4 text-accent-teal" />
        </div>
        <div>
          <p className="text-xs font-medium text-accent-teal/80">使用提示</p>
          <p className="text-[10px] text-accent-teal/40">
            填写路由器信息后，系统会自动生成"路由器重置指南"，家人只需按步骤操作即可完成网络配置
          </p>
        </div>
      </div>

      {routerMemos.length > 0 ? (
        <div className="space-y-3">
          {routerMemos.map(memo => {
            const decrypted = getDecryptedPasswords(memo);
            const relatedWifi = wifis.find(w => w.id === memo.wifi_id);
            const isGuideOpen = showGuideId === memo.id;
            const steps = resetGuideTemplate.getSteps(memo, decrypted);

            return (
              <div
                key={memo.id}
                className="bg-white/[0.01] rounded-xl border border-white/[0.06] overflow-hidden transition-all hover:border-accent-teal/15"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent-teal/10 to-cyan-500/10 text-accent-teal shrink-0">
                        <RouterIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-white">{memo.router_name}</h3>
                          {memo.model && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">
                              {memo.model}
                            </span>
                          )}
                        </div>
                        {memo.location && (
                          <p className="text-[11px] text-white/30 mt-0.5">📍 {memo.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleGuide(memo.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isGuideOpen
                            ? 'bg-accent-teal/15 text-accent-teal border border-accent-teal/30'
                            : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70 border border-transparent'
                        }`}
                      >
                        {isGuideOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        {isGuideOpen ? '收起指南' : '查看指南'}
                      </button>
                      <button
                        onClick={() => handlePrint(memo)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
                        title="打印指南"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditForm(memo)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-accent-teal transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(memo.id)}
                        className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/30 hover:text-red-400 transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Globe className="w-3.5 h-3.5 text-accent-teal" />
                        <span className="text-[11px] font-medium text-white/60">管理员地址</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenRouter(memo.admin_address)}
                          className="flex-1 flex items-center gap-1.5 text-xs font-mono text-accent-teal/80 hover:text-accent-teal transition-colors"
                        >
                          http://{memo.admin_address}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopy(`http://${memo.admin_address}`, `addr-${memo.id}`)}
                          className={`p-1 rounded transition-colors ${
                            copiedItems[`addr-${memo.id}`]
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-white/30 hover:text-white/60'
                          }`}
                        >
                          {copiedItems[`addr-${memo.id}`] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <User className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-[11px] font-medium text-white/60">管理员账号</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono text-white/80 truncate">
                          {memo.admin_username || 'admin'}
                        </code>
                        <button
                          onClick={() => handleCopy(memo.admin_username || 'admin', `user-${memo.id}`)}
                          className={`p-1 rounded transition-colors ${
                            copiedItems[`user-${memo.id}`]
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-white/30 hover:text-white/60'
                          }`}
                        >
                          {copiedItems[`user-${memo.id}`] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-medium text-white/60">管理员密码</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs font-mono text-white/80 truncate">
                          {showPasswords[`admin-${memo.id}`] ? decrypted.adminPassword : '••••••••'}
                        </code>
                        <button
                          onClick={() => togglePassword(`admin-${memo.id}`)}
                          className="p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showPasswords[`admin-${memo.id}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleCopy(decrypted.adminPassword, `adminpass-${memo.id}`)}
                          className={`p-1 rounded transition-colors ${
                            copiedItems[`adminpass-${memo.id}`]
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-white/30 hover:text-white/60'
                          }`}
                        >
                          {copiedItems[`adminpass-${memo.id}`] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {memo.broadband_account && (
                      <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px] font-medium text-white/60">宽带账号</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs font-mono text-white/80 truncate">
                            {memo.broadband_account}
                          </code>
                          <button
                            onClick={() => handleCopy(memo.broadband_account!, `bbuser-${memo.id}`)}
                            className={`p-1 rounded transition-colors ${
                              copiedItems[`bbuser-${memo.id}`]
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-white/30 hover:text-white/60'
                            }`}
                          >
                            {copiedItems[`bbuser-${memo.id}`] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {decrypted.broadbandPassword && (
                      <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px] font-medium text-white/60">宽带密码</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs font-mono text-white/80 truncate">
                            {showPasswords[`bbpass-${memo.id}`] ? decrypted.broadbandPassword : '••••••••'}
                          </code>
                          <button
                            onClick={() => togglePassword(`bbpass-${memo.id}`)}
                            className="p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                          >
                            {showPasswords[`bbpass-${memo.id}`] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => handleCopy(decrypted.broadbandPassword, `bbpass-${memo.id}`)}
                            className={`p-1 rounded transition-colors ${
                              copiedItems[`bbpass-${memo.id}`]
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-white/30 hover:text-white/60'
                            }`}
                          >
                            {copiedItems[`bbpass-${memo.id}`] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {relatedWifi && (
                      <div className="p-3 rounded-lg bg-black/20 border border-white/[0.04] md:col-span-2">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Wifi className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-[11px] font-medium text-white/60">关联 WiFi</span>
                        </div>
                        <p className="text-xs font-medium text-white/80">
                          {relatedWifi.ssid}
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400">
                            {relatedWifi.band === 'dual' ? '双频' : relatedWifi.band}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {memo.notes && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04]">
                      <p className="text-[11px] text-white/25 whitespace-pre-wrap">{memo.notes}</p>
                    </div>
                  )}
                </div>

                {isGuideOpen && (
                  <div className="border-t border-white/[0.06] p-4 bg-black/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-accent-teal" />
                        <h4 className="text-sm font-semibold text-white">路由器重置指南</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-teal/10 text-accent-teal/70">
                          {steps.length} 个步骤
                        </span>
                      </div>
                      <button
                        onClick={() => handlePrint(memo)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition-colors text-[11px] font-medium"
                      >
                        <Printer className="w-3 h-3" />
                        打印
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {steps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-white/[0.015] border border-white/[0.05] hover:border-white/[0.08] transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <div className="w-8 h-8 rounded-lg bg-accent-teal/[0.08] flex items-center justify-center text-lg">
                                {step.icon}
                              </div>
                              {idx < steps.length - 1 && (
                                <div className="w-0.5 flex-1 min-h-[20px] bg-white/[0.06] rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-semibold text-accent-teal/70">
                                  步骤 {idx + 1}
                                </span>
                                <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                              </div>
                              <p className="text-[11px] text-white/40 mb-2.5">{step.description}</p>
                              <div className="space-y-1">
                                {step.tips?.map((tip, tipIdx) => (
                                  <p
                                    key={tipIdx}
                                    className={`text-[11px] leading-relaxed whitespace-pre-wrap font-mono ${
                                      tip.includes('⚠️')
                                        ? 'text-red-400/80'
                                        : tip.startsWith('→') || tip.startsWith('问题')
                                        ? 'text-amber-400/70'
                                        : 'text-white/50'
                                    }`}
                                  >
                                    {tip}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-amber-400/80 mb-1">温馨提示</p>
                        <p className="text-[10px] text-amber-400/50">
                          如果操作过程中遇到问题，可随时点击右上角"打印"按钮将指南打印出来，方便家人对照操作。
                          建议将打印好的指南贴在路由器附近或存放于固定位置。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/[0.04]">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4">
            <RouterIcon className="w-7 h-7 text-white/10" />
          </div>
          <p className="text-sm text-white/30 mb-2">还没有添加任何路由器备忘录</p>
          <p className="text-[11px] text-white/20 mb-5 max-w-sm mx-auto">
            记录路由器管理员地址、密码、宽带账号等信息，系统将自动生成详细的操作指南，方便家人使用
          </p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
          >
            <Plus className="w-4 h-4" />
            添加第一个备忘录
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative w-full max-w-xl bg-base-900 border border-white/[0.08] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06] sticky top-0 bg-base-900/95 backdrop-blur z-10">
              <h2 className="text-base font-bold text-white font-display tracking-tight">
                {editingMemo ? '编辑路由器备忘录' : '添加路由器备忘录'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>路由器名称 <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={formRouterName}
                    onChange={e => setFormRouterName(e.target.value)}
                    required
                    placeholder="例如：主路由器、客厅路由器"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>路由器型号（可选）</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={e => setFormModel(e.target.value)}
                    placeholder="例如：华为 AX3 Pro"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>管理员地址 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formAdminAddress}
                  onChange={e => setFormAdminAddress(e.target.value)}
                  required
                  placeholder="例如：192.168.1.1"
                  className={inputClass}
                />
                <p className="text-[10px] text-white/20 mt-1">
                  常见地址：192.168.1.1、192.168.0.1、192.168.31.1、192.168.100.1，也可查看路由器背面标签
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>管理员用户名（可选）</label>
                  <input
                    type="text"
                    value={formAdminUsername}
                    onChange={e => setFormAdminUsername(e.target.value)}
                    placeholder="默认为 admin"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>管理员密码 <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <input
                      type={showFormPasswords.admin ? 'text' : 'password'}
                      value={formAdminPassword}
                      onChange={e => setFormAdminPassword(e.target.value)}
                      required
                      placeholder="输入管理员密码"
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPasswords(prev => ({ ...prev, admin: !prev.admin }))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showFormPasswords.admin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-3">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">宽带信息（可选）</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>宽带账号</label>
                    <input
                      type="text"
                      value={formBroadbandAccount}
                      onChange={e => setFormBroadbandAccount(e.target.value)}
                      placeholder="例如：02112345678"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>宽带密码</label>
                    <div className="relative">
                      <input
                        type={showFormPasswords.broadband ? 'text' : 'password'}
                        value={formBroadbandPassword}
                        onChange={e => setFormBroadbandPassword(e.target.value)}
                        placeholder="输入宽带密码"
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPasswords(prev => ({ ...prev, broadband: !prev.broadband }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showFormPasswords.broadband ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-white/20 mt-1">
                  如不清楚宽带账号密码，可拨打运营商客服电话咨询：电信 10000、移动 10086、联通 10010
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>关联 WiFi（可选）</label>
                  <select
                    value={formWifiId || ''}
                    onChange={e => setFormWifiId(e.target.value || undefined)}
                    className={inputClass}
                  >
                    <option value="">不关联</option>
                    {wifis.map(w => (
                      <option key={w.id} value={w.id}>{w.ssid}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>摆放位置（可选）</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder="例如：客厅电视柜、书房"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>备注（可选）</label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="例如：安装日期、保修信息、运营商、客服电话等"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-accent-teal/[0.04] border border-accent-teal/10">
                <AlertCircle className="w-4 h-4 text-accent-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-accent-teal/80 mb-0.5">保存后将自动生成操作指南</p>
                  <p className="text-[10px] text-accent-teal/50">
                    包含登录后台、修改 WiFi 密码、重启设备、恢复出厂设置、常见问题排查等步骤
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-white/[0.04] text-white/60 rounded-lg hover:bg-white/[0.08] hover:text-white transition-all text-sm font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-accent-teal text-base-950 rounded-lg hover:bg-accent-tealLight transition-all text-sm font-semibold shadow-lg shadow-accent-teal/20"
                >
                  {editingMemo ? '保存修改' : '添加备忘录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
