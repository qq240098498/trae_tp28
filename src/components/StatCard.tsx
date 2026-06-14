import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'teal' | 'emerald' | 'violet' | 'amber';
  subtitle?: string;
}

const colorClasses = {
  teal: {
    bg: 'from-accent-teal/8 to-cyan-500/4',
    border: 'border-accent-teal/10',
    icon: 'bg-accent-teal/10 text-accent-teal',
    glow: 'group-hover:shadow-accent-teal/5',
  },
  emerald: {
    bg: 'from-emerald-500/8 to-green-500/4',
    border: 'border-emerald-500/10',
    icon: 'bg-emerald-500/10 text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/5',
  },
  violet: {
    bg: 'from-violet-500/8 to-purple-500/4',
    border: 'border-violet-500/10',
    icon: 'bg-violet-500/10 text-violet-400',
    glow: 'group-hover:shadow-violet-500/5',
  },
  amber: {
    bg: 'from-amber-500/8 to-orange-500/4',
    border: 'border-amber-500/10',
    icon: 'bg-amber-500/10 text-amber-400',
    glow: 'group-hover:shadow-amber-500/5',
  },
};

export function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const c = colorClasses[color];

  return (
    <div className={`group relative rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg ${c.glow}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium text-white/30 mb-1 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold text-white font-display tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-[11px] text-white/20 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${c.icon}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
