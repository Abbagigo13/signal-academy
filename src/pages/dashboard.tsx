// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Bitcoin, TrendingUp, ChevronDown } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import SignalCard from '@/components/dashboard/SignalCard';
import AIPanel from '@/components/dashboard/AIPanel';
import LessonsGrid from '@/components/dashboard/LessonsGrid';
import ChatPanel from '@/components/dashboard/ChatPanel';
import TradePanel from '@/components/dashboard/TradePanel';
import ProfilePanel from '@/components/dashboard/ProfilePanel';
import ComparePanel from '@/components/dashboard/ComparePanel';

type View = 'overview' | 'tutor' | 'trade' | 'learn' | 'profile';

interface Asset {
  symbol: string;
  label: string;
  short: string;
  type: 'crypto' | 'stock';
}

const ASSETS: Asset[] = [
  { symbol: 'BTCUSDT', label: 'BTC / Bitcoin', short: 'BTC', type: 'crypto' },
  { symbol: 'ETHUSDT', label: 'ETH / Ethereum', short: 'ETH', type: 'crypto' },
  { symbol: 'SOLUSDT', label: 'SOL / Solana', short: 'SOL', type: 'crypto' },
  { symbol: 'RTSLAUSDT', label: 'rTSLA / Tesla', short: 'TSLA', type: 'stock' },
  { symbol: 'RNVDAUSDT', label: 'rNVDA / NVIDIA', short: 'NVDA', type: 'stock' },
  { symbol: 'RAAPLUSDT', label: 'rAAPL / Apple', short: 'AAPL', type: 'stock' },
  { symbol: 'RMSFTUSDT', label: 'rMSFT / Microsoft', short: 'MSFT', type: 'stock' },
  { symbol: 'RMETAUSDT', label: 'rMETA / Meta', short: 'META', type: 'stock' },
];

const VALID_VIEWS: View[] = ['overview', 'tutor', 'trade', 'learn', 'profile'];

export default function Dashboard() {
  const router = useRouter();
  const [view, setView] = useState<View>('overview');
  const [symbol, setSymbol] = useState<string>('BTCUSDT');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { insights, aiSummary, loading, error, refresh, source } =
    useMarketData(symbol);

  // Sync view from URL query (?view=tutor, ?view=learn, etc.)
  useEffect(() => {
    if (!router.isReady) return;
    const queryView = router.query.view;
    if (typeof queryView === 'string' && VALID_VIEWS.includes(queryView as View)) {
      setView(queryView as View);
    }
  }, [router.isReady, router.query.view]);

  const currentAsset = ASSETS.find((a) => a.symbol === symbol) || ASSETS[0];
  const isStock = currentAsset.type === 'stock';

  return (
    <>
      <Head>
        <title>Dashboard · Signal Academy</title>
      </Head>

      <div className="flex min-h-screen bg-[#0A0E1A] text-white">
        <Sidebar
          currentView={view}
          onNavigate={setView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-[260px] px-4 sm:px-6 lg:px-8 pb-8 max-w-full overflow-x-hidden">
          <Topbar
            title={
              {
                overview: 'Overview',
                tutor: 'AI Tutor',
                trade: 'Paper Trading',
                learn: 'Lessons',
                profile: 'Profile',
              }[view]
            }
            connected={!error}
            loading={loading}
            onRefresh={refresh}
            source={source}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {/* Overview */}
          {view === 'overview' && (
            <div className="space-y-5 lg:space-y-6">
              {/* Asset Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    {isStock ? (
                      <TrendingUp className="w-4 h-4 text-[#1DA2B4]" />
                    ) : (
                      <Bitcoin className="w-4 h-4 text-[#1DA2B4]" />
                    )}
                    <span className="truncate">{currentAsset.label}</span>
                  </h2>
                  <p className="text-xs text-[#8899BB] mt-0.5">
                    {isStock ? 'Tokenized US Stock' : 'Cryptocurrency'}
                    {source === 'mock' && (
                      <span className="ml-2 text-yellow-500">· mock data</span>
                    )}
                  </p>
                </div>

                <div className="relative w-full sm:w-auto">
                  <select
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-[#131B2E] border border-white/10 hover:border-[#1DA2B4]/50 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-white outline-none focus:border-[#1DA2B4] transition-all cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    <optgroup
                      label="🪙 Crypto"
                      className="bg-[#1A2340] text-[#8899BB]"
                    >
                      {ASSETS.filter((a) => a.type === 'crypto').map((a) => (
                        <option
                          key={a.symbol}
                          value={a.symbol}
                          className="bg-[#1A2340] text-white"
                        >
                          {a.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup
                      label="📈 Tokenized Stocks"
                      className="bg-[#1A2340] text-[#8899BB]"
                    >
                      {ASSETS.filter((a) => a.type === 'stock').map((a) => (
                        <option
                          key={a.symbol}
                          value={a.symbol}
                          className="bg-[#1A2340] text-white"
                        >
                          {a.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#8899BB] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Signal Cards — 2 cols on mobile, 4 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                <SignalCard
                  icon="fa-globe"
                  label="Macro"
                  value={insights?.macro?.trend || 'Neutral'}
                  sub={insights?.macro?.summary || 'Loading macro data...'}
                  loading={loading}
                />
                <SignalCard
                  icon="fa-chart-simple"
                  label="Technical"
                  value={
                    insights?.technical?.rsi
                      ? insights.technical.rsi.toFixed(1)
                      : '—'
                  }
                  sub={`RSI · ${insights?.technical?.signal || 'Analyzing...'}`}
                  loading={loading}
                  trend={
                    insights?.technical?.signal === 'Bullish'
                      ? 'up'
                      : insights?.technical?.signal === 'Bearish'
                      ? 'down'
                      : 'neutral'
                  }
                />
                <SignalCard
                  icon="fa-face-smile"
                  label="Sentiment"
                  value={insights?.sentiment?.fearGreed ?? '—'}
                  sub={insights?.sentiment?.label || 'Reading market mood...'}
                  loading={loading}
                  trend={
                    insights?.sentiment?.signal === 'Bullish'
                      ? 'up'
                      : insights?.sentiment?.signal === 'Bearish'
                      ? 'down'
                      : 'neutral'
                  }
                />
                <SignalCard
                  icon="fa-link"
                  label="On-Chain"
                  value={insights?.onChain?.signal || 'Neutral'}
                  sub={insights?.onChain?.summary || 'Tracking volume...'}
                  loading={loading}
                />
              </div>

              <AIPanel summary={aiSummary} loading={loading} />

              <ComparePanel />
            </div>
          )}

          {/* Tutor */}
          {view === 'tutor' && (
            <ChatPanel marketContext={JSON.stringify(insights)} />
          )}

          {/* Trade */}
          {view === 'trade' && <TradePanel insights={insights} />}

          {/* Learn */}
          {view === 'learn' && <LessonsGrid />}

          {/* Profile */}
          {view === 'profile' && <ProfilePanel />}
        </main>
      </div>
    </>
  );
}