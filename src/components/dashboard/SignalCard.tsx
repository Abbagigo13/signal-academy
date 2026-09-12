// src/components/dashboard/SignalCard.tsx
import {
  Globe,
  TrendingUp,
  Smile,
  Link as LinkIcon,
  Activity,
  DollarSign,
  BarChart3,
  Zap,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'fa-globe': Globe,
  'fa-chart-simple': BarChart3,
  'fa-face-smile': Smile,
  'fa-link': LinkIcon,
  'fa-chart-line': TrendingUp,
  'fa-activity': Activity,
  'fa-dollar-sign': DollarSign,
  'fa-bolt': Zap,
};

interface Props {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  loading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export default function SignalCard({
  icon,
  label,
  value,
  sub,
  loading,
  trend,
}: Props) {
  const Icon = ICONS[icon] || Globe;

  const trendColor =
    trend === 'up'
      ? 'text-[#00D4AA]'
      : trend === 'down'
      ? 'text-[#FF6B6B]'
      : 'text-white';

  const trendBg =
    trend === 'up'
      ? 'bg-[#00D4AA]/10'
      : trend === 'down'
      ? 'bg-[#FF6B6B]/10'
      : 'bg-white/5';

  return (
    <div className="bg-[#131B2E] border border-white/5 rounded-2xl p-5 transition-all hover:border-[#1DA2B4]/30 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold">
          <div className={`w-6 h-6 rounded-lg ${trendBg} flex items-center justify-center`}>
            <Icon className="w-3.5 h-3.5 text-[#1DA2B4]" />
          </div>
          {label}
        </div>

        {trend && !loading && (
          <div
            className={`text-[10px] font-bold ${
              trend === 'up'
                ? 'text-[#00D4AA]'
                : trend === 'down'
                ? 'text-[#FF6B6B]'
                : 'text-[#8899BB]'
            }`}
          >
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}
          </div>
        )}
      </div>

      <div
        className={`text-2xl font-extrabold mb-1 leading-tight ${
          loading ? 'text-[#8899BB]' : trendColor
        }`}
      >
        {loading ? '—' : value}
      </div>

      <div className="text-xs text-[#8899BB] leading-snug line-clamp-2">
        {sub}
      </div>
    </div>
  );
}