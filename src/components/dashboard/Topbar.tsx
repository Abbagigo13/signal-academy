// src/components/dashboard/Topbar.tsx
import { RotateCw, Menu } from 'lucide-react';

interface Props {
  title: string;
  connected: boolean;
  loading: boolean;
  onRefresh: () => void;
  source?: string | null;
  onOpenSidebar: () => void;
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
    return { color: 'text-[#1DA2B4]', dot: '🔵', label: 'Live · Snapshot data' };
  }
  if (source === 'yahoo-snapshot') {
    return {
      color: 'text-[#1DA2B4]',
      dot: '🔵',
      label: 'Live · Stock snapshot',
    };
  }
  if (source === 'mock') {
    return { color: 'text-yellow-500', dot: '🟡', label: 'Offline · Mock data' };
  }
  return { color: 'text-[#8899BB]', dot: '⚪', label: 'Live · Connected' };
}

export default function Topbar({
  title,
  connected,
  loading,
  onRefresh,
  source,
  onOpenSidebar,
}: Props) {
  const status = getStatus(loading, connected, source);

  return (
    <header className="sticky top-0 z-30 bg-[#0A0E1A]/95 backdrop-blur-sm py-4 lg:py-6 border-b border-white/5 mb-6 lg:mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#131B2E] border border-white/5 text-[#8899BB] hover:text-[#1DA2B4] flex items-center justify-center flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight truncate">
            {title}
          </h1>
          <div
            className={`flex items-center gap-2 mt-0.5 text-xs ${status.color}`}
          >
            <span className="text-[10px]">{status.dot}</span>
            <span className="truncate">{status.label}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-10 h-10 rounded-xl bg-[#131B2E] border border-white/5 text-[#8899BB] hover:text-[#1DA2B4] hover:border-[#1DA2B4] transition-all disabled:opacity-50 flex items-center justify-center"
          aria-label="Refresh"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#131B2E] rounded-full text-sm font-medium">
          <span className="text-[#1DA2B4]">👨‍🚀</span>
          Learner
        </div>

        <div className="sm:hidden w-10 h-10 rounded-full bg-[#131B2E] flex items-center justify-center">
          <span className="text-[#1DA2B4]">👨‍🚀</span>
        </div>
      </div>
    </header>
  );
}