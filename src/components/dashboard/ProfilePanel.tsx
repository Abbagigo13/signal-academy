// src/components/dashboard/ProfilePanel.tsx
import { useEffect, useState } from 'react';
import {
  Trophy,
  BookOpen,
  TrendingUp,
  Flame,
  Award,
  Target,
  DollarSign,
  Activity,
} from 'lucide-react';
import { getLessons, getPoints, getTrades, getBalance, onBalanceChange, Lesson, Trade } from '@/lib/storage';

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
}

export default function ProfilePanel() {
  const [points, setPoints] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(3000);

  useEffect(() => {
    setPoints(getPoints());
    setLessons(getLessons());
    setTrades(getTrades());
    setBalance(getBalance());
    return onBalanceChange(() => {
      setBalance(getBalance());
      setTrades(getTrades());
    });
  }, []);

  const completedLessons = lessons.filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const buyTrades = trades.filter((t) => t.side === 'buy').length;
  const sellTrades = trades.filter((t) => t.side === 'sell').length;

  // Badge definitions — unlocked based on progress
  const badges: Badge[] = [
    {
      id: 'first-lesson',
      name: 'First Steps',
      desc: 'Complete your first lesson',
      icon: BookOpen,
      earned: completedLessons >= 1,
    },
    {
      id: 'half-way',
      name: 'Half Way There',
      desc: 'Complete 3 lessons',
      icon: Target,
      earned: completedLessons >= 3,
    },
    {
      id: 'scholar',
      name: 'Scholar',
      desc: 'Complete all 5 lessons',
      icon: Trophy,
      earned: completedLessons >= totalLessons && totalLessons > 0,
    },
    {
      id: 'first-trade',
      name: 'First Trade',
      desc: 'Place your first paper trade',
      icon: TrendingUp,
      earned: trades.length >= 1,
    },
    {
      id: 'active-trader',
      name: 'Active Trader',
      desc: 'Place 5 paper trades',
      icon: Activity,
      earned: trades.length >= 5,
    },
    {
      id: 'balanced',
      name: 'Balanced',
      desc: 'Place both a buy and a sell',
      icon: Award,
      earned: buyTrades >= 1 && sellTrades >= 1,
    },
    {
      id: 'momentum',
      name: 'Momentum Reader',
      desc: 'Earn 50 points',
      icon: Flame,
      earned: points >= 50,
    },
    {
      id: 'master',
      name: 'Signal Master',
      desc: 'Earn 100 points',
      icon: DollarSign,
      earned: points >= 100,
    },
  ];

  const earnedBadges = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-[#191F61]/40 via-[#131B2E] to-[#131B2E] border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-[#1DA2B4]/30">
            L
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">Learner</h2>
            <p className="text-[#8899BB] text-sm mt-1">
              Signal Academy · Bitget Hackathon S2
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 bg-[#1DA2B4]/15 text-[#1DA2B4] rounded-full text-xs font-bold">
                {points} points
              </span>
              <span className="px-3 py-1 bg-yellow-500/15 text-yellow-500 rounded-full text-xs font-bold">
                {earnedBadges} / {badges.length} badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#131B2E] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold">
              Balance
            </div>
          </div>
          <div
            className={`text-3xl font-extrabold ${
              balance >= 3000 ? 'text-[#1DA2B4]' : 'text-[#FF6B6B]'
            }`}
          >
            {balance.toFixed(2)}
          </div>
          <div className="text-xs text-[#8899BB] mt-2">SUSDT paper balance</div>
        </div>

        <div className="bg-[#131B2E] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold">
              Lessons
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {completedLessons}{' '}
            <span className="text-[#8899BB] text-lg font-medium">
              / {totalLessons}
            </span>
          </div>
          <div className="text-xs text-[#8899BB] mt-2">completed</div>
        </div>

        <div className="bg-[#131B2E] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold">
              Paper Trades
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {trades.length}
          </div>
          <div className="text-xs text-[#8899BB] mt-2">
            {buyTrades} buys · {sellTrades} sells
          </div>
        </div>

        <div className="bg-[#131B2E] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold">
              Points
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#1DA2B4]">
            {points}
          </div>
          <div className="text-xs text-[#8899BB] mt-2">earned so far</div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#1DA2B4]" />
            <h2 className="font-bold">Badges</h2>
          </div>
          <span className="text-xs text-[#8899BB]">
            {earnedBadges} unlocked
          </span>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 text-center transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-[#1DA2B4]/15 to-[#191F61]/20 border border-[#1DA2B4]/30'
                    : 'bg-[#0A0E1A]/40 border border-white/5 opacity-40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    badge.earned
                      ? 'bg-[#1DA2B4]/20 text-[#1DA2B4]'
                      : 'bg-white/5 text-[#8899BB]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div
                  className={`text-sm font-bold ${
                    badge.earned ? 'text-white' : 'text-[#8899BB]'
                  }`}
                >
                  {badge.name}
                </div>
                <div className="text-[11px] text-[#8899BB] mt-1 leading-tight">
                  {badge.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <Activity className="w-5 h-5 text-[#1DA2B4]" />
          <h2 className="font-bold">Recent Activity</h2>
        </div>
        <div className="p-6">
          {trades.length === 0 ? (
            <div className="text-center py-8 text-[#8899BB] text-sm">
              No trades yet. Head to{' '}
              <span className="text-[#1DA2B4] font-semibold">
                Paper Trading
              </span>{' '}
              to place your first one.
            </div>
          ) : (
            <div className="space-y-3">
              {trades
                .slice(-5)
                .reverse()
                .map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 bg-[#0A0E1A]/40 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          trade.side === 'buy'
                            ? 'bg-[#00D4AA]'
                            : 'bg-[#FF6B6B]'
                        }`}
                      />
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {trade.side.toUpperCase()} {trade.symbol}
                        </div>
                        <div className="text-[11px] text-[#8899BB]">
                          {new Date(trade.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#1DA2B4]">
                        {trade.size} SUSDT
                      </div>
                      {typeof trade.pnl === 'number' ? (
                        <div
                          className={`text-xs font-semibold ${
                            trade.pnl >= 0 ? 'text-[#00D4AA]' : 'text-[#FF6B6B]'
                          }`}
                        >
                          {trade.pnl >= 0 ? '+' : ''}
                          {trade.pnl.toFixed(2)} SUSDT
                        </div>
                      ) : (
                        <div className="text-xs text-[#8899BB]">unresolved</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}