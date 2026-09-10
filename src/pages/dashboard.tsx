// src/pages/dashboard.tsx
import { useState } from 'react';
import Head from 'next/head';
import { useMarketData } from '@/hooks/useMarketData';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import SignalCard from '@/components/dashboard/SignalCard';
import AIPanel from '@/components/dashboard/AIPanel';
import LessonsGrid from '@/components/dashboard/LessonsGrid';
import ChatPanel from '@/components/dashboard/ChatPanel';
import TradePanel from '@/components/dashboard/TradePanel';
import ProfilePanel from '@/components/dashboard/ProfilePanel';

type View = 'overview' | 'tutor' | 'trade' | 'learn' | 'profile';

export default function Dashboard() {
  const [view, setView] = useState<View>('overview');
  const { insights, aiSummary, loading, error, refresh } = useMarketData();

  return (
    <>
      <Head>
        <title>Dashboard · Signal Academy</title>
      </Head>

      <div className="flex min-h-screen bg-[#0A0E1A] text-white">
        <Sidebar currentView={view} onNavigate={setView} />

        <main className="flex-1 ml-[260px] px-8 pb-8">
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
          />

          {/* Overview */}
          {view === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <SignalCard
                  icon="fa-globe"
                  label="Macro"
                  value={insights?.macro?.trend || 'Neutral'}
                  sub={insights?.macro?.summary || 'Loading...'}
                  loading={loading}
                />
                <SignalCard
  icon="fa-chart-simple"
  label="Technical"
  value={insights?.technical?.rsi ? insights.technical.rsi.toFixed(1) : '—'}
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
  value={insights?.sentiment?.fearGreed || '—'}
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
                  sub={insights?.onChain?.summary || 'Tracking whales...'}
                  loading={loading}
                />
              </div>

              <AIPanel summary={aiSummary} loading={loading} />
            </div>
          )}

          {/* Tutor */}
          {view === 'tutor' && <ChatPanel marketContext={JSON.stringify(insights)} />}

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