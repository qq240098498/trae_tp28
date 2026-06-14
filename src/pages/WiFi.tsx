import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { WiFiCard } from '@/components/WiFiCard';
import { WiFiForm } from '@/components/WiFiForm';
import { PasswordModal } from '@/components/PasswordModal';
import type { WiFi, WiFiFormData, WiFiBand } from '@/types';
import { wifiBandLabels } from '@/types';

const wifiBands: (WiFiBand | 'all')[] = ['all', '2.4G', '5G', 'dual'];

export function WiFi() {
  const wifis = useStore(state => state.wifis);
  const encryptionKey = useStore(state => state.encryptionKey);
  const addWiFi = useStore(state => state.addWiFi);
  const updateWiFi = useStore(state => state.updateWiFi);
  const deleteWiFi = useStore(state => state.deleteWiFi);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBand, setFilterBand] = useState<WiFiBand | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWiFi, setEditingWiFi] = useState<WiFi | null>(null);
  const [viewingWiFi, setViewingWiFi] = useState<WiFi | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const filteredWifis = wifis.filter(wifi => {
    const matchesSearch = wifi.ssid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wifi.notes && wifi.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBand = filterBand === 'all' || wifi.band === filterBand;
    return matchesSearch && matchesBand;
  });

  const handleAdd = () => {
    if (!encryptionKey) {
      alert('请先在密码中心设置主密码并解锁，才能添加 WiFi');
      return;
    }
    setEditingWiFi(null);
    setIsFormOpen(true);
  };

  const handleEdit = (wifi: WiFi) => {
    if (!encryptionKey) {
      alert('请先解锁应用才能编辑');
      return;
    }
    setEditingWiFi(wifi);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个 WiFi 吗？')) {
      deleteWiFi(id);
    }
  };

  const handleViewPassword = (wifi: WiFi) => {
    setViewingWiFi(wifi);
    setIsPasswordModalOpen(true);
  };

  const handleSubmit = (data: WiFiFormData) => {
    if (editingWiFi) {
      updateWiFi(editingWiFi.id, data);
    } else {
      addWiFi(data);
    }
    setIsFormOpen(false);
    setEditingWiFi(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight mb-1">
            WiFi 管理
          </h1>
          <p className="text-sm text-white/30">管理家中 WiFi 网络和密码</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-400 transition-all text-sm font-semibold shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          添加 WiFi
        </button>
      </div>

      {!encryptionKey && (
        <div className="p-3 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg text-amber-400/80 text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
          请先在密码中心设置主密码并解锁，才能添加或编辑 WiFi 密码
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="搜索 WiFi 名称..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-white/20 flex-shrink-0" />
          {wifiBands.map(band => (
            <button
              key={band}
              onClick={() => setFilterBand(band)}
              className={`px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap transition-all font-medium ${
                filterBand === band
                  ? band === '2.4G'
                    ? 'bg-amber-500/[0.08] text-amber-400 border border-amber-500/20'
                    : band === '5G'
                      ? 'bg-violet-500/[0.08] text-violet-400 border border-violet-500/20'
                      : band === 'dual'
                        ? 'bg-accent-teal/[0.08] text-accent-teal border border-accent-teal/20'
                        : 'bg-accent-teal/[0.08] text-accent-teal border border-accent-teal/20'
                  : 'bg-black/10 text-white/25 border border-transparent hover:bg-white/[0.04] hover:text-white/40'
              }`}
            >
              {band === 'all' ? '全部' : wifiBandLabels[band]}
            </button>
          ))}
        </div>
      </div>

      {filteredWifis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWifis.map(wifi => (
            <WiFiCard
              key={wifi.id}
              wifi={wifi}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewPassword={handleViewPassword}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/[0.01] rounded-xl border border-white/[0.04]">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-white/10" />
          </div>
          <p className="text-sm text-white/30 mb-2">
            {wifis.length === 0 ? '还没有添加任何 WiFi' : '没有找到匹配的 WiFi'}
          </p>
          {wifis.length === 0 && (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500 text-white rounded-lg hover:bg-violet-400 transition-all text-xs font-semibold shadow-lg shadow-violet-500/20 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              添加第一个 WiFi
            </button>
          )}
        </div>
      )}

      <WiFiForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingWiFi(null);
        }}
        onSubmit={handleSubmit}
        wifi={editingWiFi}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setViewingWiFi(null);
        }}
        wifi={viewingWiFi}
      />
    </div>
  );
}
