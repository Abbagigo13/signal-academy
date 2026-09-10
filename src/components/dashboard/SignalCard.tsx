// src/components/dashboard/SignalCard.tsx
interface Props {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  loading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export default function SignalCard({ icon, label, value, sub, loading, trend }: Props) {
  const trendColor =
    trend === 'up' ? 'text-[#00D4AA]' : trend === 'down' ? 'text-[#FF6B6B]' : 'text-white';

  return (
    <div className="bg-[#131B2E] border border-white/5 rounded-2xl p-5 transition-all hover:border-[#1DA2B4]/30 hover:-translate-y-0.5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold mb-4">
        <i className={`fa-solid ${icon} text-[#1DA2B4]`} />
        {label}
      </div>
      <div className={`text-2xl font-extrabold mb-1 ${loading ? 'text-[#8899BB]' : trendColor}`}>
        {loading ? '—' : value}
      </div>
      <div className="text-xs text-[#8899BB]">{sub}</div>
    </div>
  );
}