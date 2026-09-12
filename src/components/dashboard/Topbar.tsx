// src/components/dashboard/Topbar.tsx
import { RotateCw } from 'lucide-react';

interface Props {
  title: string;
  connected: boolean;
  loading: boolean;
  onRefresh: () => void;
  source?: string | null;
}

function getStatus(
  loading: boolean,
  connected: boolean,
  source: string | null | undefined
) {
  if (loading) {
    return { color: 'text-yellow-500', dot: '🟡', label: 'Fetching signals...' };
  }
  if (!connected) {
    return { color: 'text-red-500', dot: '🔴', label: 'Connection error' };
  }
  if (source === 'bitget-v3') {
    return { color: 'text-[#00D4AA]', dot: '🟢', label: 'Live · Bitget API v3' };
  }
  if (source === 'bitget-v2') {
    return { color: 'text-[#00D4AA]', dot: '🟢', label: 'Live · Bitget API v2' };
  }
  if (source === 'coinmarketcap') {
    return {
      color: 'text-[#00D4AA]',
      dot: '🟢',
      label: 'Live · CoinMarketCap',
    };
  }
  if (source === 'snapshot') {
    return {
      color: 'text-[#1DA2B4]',
      dot: '🔵',
      label: 'Live · Snapshot data',
    };
  }
  if (source === 'yahoo-snapshot') {
    return {
      color: 'text-[#1DA2B4]',
      dot: '🔵',
      label: 'Live · Stock snapshot',
    };
  }
  if (source === 'mock') {
    return {
      color: 'text-yellow-500',
      dot: '🟡',
      label: 'Offline · Mock data',
    };
  }
  return { color: 'text-[#8899BB]', dot: '⚪', label: 'Live · Connected' };
}

export default function Topbar({
  title,
  connected,
  loading,
  onRefresh,
  source,
}: Props) {
  const status = getStatus(loading, connected, source);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0E1A] py-6 border-b border-white/5 mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <div className={`flex items-center gap-2 mt-1 text-xs ${status.color}`}>
          <span className="text-[10px]">{status.dot}</span>
          {status.label}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-10 h-10 rounded-xl bg-[#131B2E] border border-white/5 text-[#8899BB] hover:text-[#1DA2B4] hover:border-[#1DA2B4] transition-all disabled:opacity-50 flex items-center justify-center"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#131B2E] rounded-full text-sm font-medium">
          <span className="text-[#1DA2B4]">👨‍🚀</span>
          Learner
        </div>
      </div>
    </header>
  );
}