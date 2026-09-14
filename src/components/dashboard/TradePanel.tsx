// src/components/dashboard/TradePanel.tsx
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { askTutor } from '@/lib/ai';
import { getMarketInsights, MarketInsights } from '@/lib/signals';
import {
  saveTrade,
  getBalance,
  adjustBalance,
  onBalanceChange,
  Trade,
} from '@/lib/storage';

export default function TradePanel({ insights: overviewInsights }: { insights: any }) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [size, setSize] = useState(100);
  const [stressResult, setStressResult] = useState('');
  const [tradeResult, setTradeResult] = useState<{
    text: string;
    outcome: 'win' | 'loss';
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalanceState] = useState(3000);

  // This panel's own market data — deliberately independent from the Overview
  // page's `insights`, since the user can pick a different symbol to trade
  // than whatever happens to be selected on the Overview screen.
  const [tradeInsights, setTradeInsights] = useState<MarketInsights | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    setBalanceState(getBalance());
    return onBalanceChange(() => setBalanceState(getBalance()));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPriceLoading(true);
    getMarketInsights(symbol).then((data) => {
      if (!cancelled) {
        setTradeInsights(data);
        setPriceLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const currentPrice = tradeInsights?.technical?.price
    ? parseFloat(tradeInsights.technical.price)
    : null;

  const handleStressTest = async () => {
    setLoading(true);
    setStressResult('Running stress test...');

    const prompt = `Challenge this trade decision like a risk manager:
Trade: ${side.toUpperCase()} ${symbol} for ${size} SUSDT
Market context: ${JSON.stringify(tradeInsights?.technical || overviewInsights?.technical || {})}

Provide:
1. What could go wrong?
2. Worst-case scenarios
3. Alternative strategies`;

    const response = await askTutor(prompt);
    setStressResult(response);
    setLoading(false);
  };

  const handleExecute = async () => {
    setError('');
    setTradeResult(null);

    if (!size || size <= 0) {
      setError('Enter a size greater than 0.');
      return;
    }

    setExecuting(true);

    // Use the freshest price we have; if the periodic fetch hasn't
    // resolved yet, fetch once more right before filling the trade.
    let fillPrice = currentPrice;
    let signal = tradeInsights?.technical?.signal;
    if (fillPrice === null) {
      const fresh = await getMarketInsights(symbol);
      fillPrice = fresh?.technical?.price ? parseFloat(fresh.technical.price) : 0;
      signal = fresh?.technical?.signal;
    }

    // Simulated instant fill + resolution: this is a demo paper-trading
    // flow with no live position tracking, so we resolve the trade
    // immediately with a randomized price move. The move is weighted
    // by whether the chosen side agrees with the current technical
    // signal, so trades aligned with the signal skew slightly favorable
    // and trades against it skew slightly unfavorable — same idea as
    // the "confidence" framing elsewhere in the app, not a guarantee.
    const agreesWithSignal =
      (side === 'buy' && signal === 'Bullish') ||
      (side === 'sell' && signal === 'Bearish');
    const disagreesWithSignal =
      (side === 'buy' && signal === 'Bearish') ||
      (side === 'sell' && signal === 'Bullish');

    const bias = agreesWithSignal ? 0.6 : disagreesWithSignal ? -0.6 : 0;
    const randomComponent = (Math.random() * 2 - 1) * 2.2; // -2.2% .. +2.2%
    const pctMove = randomComponent + bias; // percent move in the trade's favor

    const pnl = Math.round(size * (pctMove / 100) * 100) / 100;
    const exitPrice = fillPrice ? fillPrice * (1 + pctMove / 100) : 0;
    const newBalance = adjustBalance(pnl);

    const trade: Trade = {
      id: Date.now().toString(),
      symbol,
      side,
      size,
      price: fillPrice || 0,
      timestamp: new Date().toISOString(),
      entryPrice: fillPrice || 0,
      exitPrice,
      pnl,
      pnlPercent: pctMove,
      balanceAfter: newBalance,
    };
    saveTrade(trade);
    setBalanceState(newBalance);

    const outcome: 'win' | 'loss' = pnl >= 0 ? 'win' : 'loss';
    const pnlText = `${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} SUSDT (${
      pctMove >= 0 ? '+' : ''
    }${pctMove.toFixed(2)}%)`;

    setTradeResult({
      text: `${outcome === 'win' ? '✅' : '🔻'} ${side.toUpperCase()} ${symbol} for ${size} SUSDT filled at $${(fillPrice || 0).toLocaleString()}. Result: ${pnlText}. New balance: ${newBalance.toFixed(2)} SUSDT.`,
      outcome,
    });
    setExecuting(false);
  };

  return (
    <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-arrow-right-arrow-left text-[#1DA2B4]" />
          <h2 className="font-bold">Paper Trade</h2>
        </div>
        <span className="px-3 py-1 bg-yellow-500/15 text-yellow-500 rounded-full text-[11px] font-semibold">
          Demo Mode
        </span>
      </div>

      <div className="p-6">
        {/* Balance */}
        <div className="mb-5 flex items-center justify-between bg-gradient-to-br from-[#1DA2B4]/15 to-[#191F61]/30 rounded-xl p-4">
          <div>
            <div className="text-[11px] text-[#8899BB] uppercase tracking-wider">
              Paper Balance
            </div>
            <div
              className={`text-2xl font-extrabold mt-1 ${
                balance >= 3000 ? 'text-[#1DA2B4]' : 'text-[#FF6B6B]'
              }`}
            >
              {balance.toFixed(2)}{' '}
              <span className="text-sm font-medium text-[#8899BB]">SUSDT</span>
            </div>
          </div>
          {currentPrice !== null && (
            <div className="text-right">
              <div className="text-[11px] text-[#8899BB] uppercase tracking-wider">
                {symbol} Price
              </div>
              <div className="text-lg font-bold text-white mt-1">
                ${currentPrice.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold block mb-2">
              Symbol
            </label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-[#1A2340] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1DA2B4] text-white"
              style={{ colorScheme: 'dark' }}
            >
              <optgroup label="🪙 Crypto" className="bg-[#1A2340] text-[#8899BB]">
                <option value="BTCUSDT" className="bg-[#1A2340] text-white">BTC / Bitcoin</option>
                <option value="ETHUSDT" className="bg-[#1A2340] text-white">ETH / Ethereum</option>
                <option value="SOLUSDT" className="bg-[#1A2340] text-white">SOL / Solana</option>
              </optgroup>
              <optgroup label="📈 Tokenized Stocks" className="bg-[#1A2340] text-[#8899BB]">
                <option value="RTSLAUSDT" className="bg-[#1A2340] text-white">rTSLA / Tesla</option>
                <option value="RNVDAUSDT" className="bg-[#1A2340] text-white">rNVDA / NVIDIA</option>
                <option value="RAAPLUSDT" className="bg-[#1A2340] text-white">rAAPL / Apple</option>
                <option value="RMSFTUSDT" className="bg-[#1A2340] text-white">rMSFT / Microsoft</option>
                <option value="RMETAUSDT" className="bg-[#1A2340] text-white">rMETA / Meta</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold block mb-2">
              Side
            </label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
              className="w-full bg-[#1A2340] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1DA2B4] text-white"
              style={{ colorScheme: 'dark' }}
            >
              <option value="buy" className="bg-[#1A2340] text-white">Buy / Long</option>
              <option value="sell" className="bg-[#1A2340] text-white">Sell / Short</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold block mb-2">
              Size (SUSDT)
            </label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full bg-[#1A2340] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1DA2B4] text-white"
            />
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl text-sm text-[#FF6B6B]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <button
            onClick={handleStressTest}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#1A2340] border border-white/5 text-white font-semibold hover:border-[#1DA2B4] hover:text-[#1DA2B4] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-shield-halved" />
            {loading ? 'Testing...' : 'Stress Test with AI'}
          </button>

          <button
            onClick={handleExecute}
            disabled={executing || priceLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1DA2B4]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <i className="fa-solid fa-bolt" />
            {executing ? 'Executing...' : 'Execute Paper Trade'}
          </button>
        </div>

        {stressResult && (
          <div className="mt-5 p-5 bg-[#1A2340] rounded-xl text-sm leading-relaxed text-[#8899BB]">
            <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-3">
              <i className="fa-solid fa-triangle-exclamation" />
              AI Risk Analysis
            </div>
            <div className="prose prose-invert prose-sm max-w-none prose-strong:text-yellow-500 prose-p:text-[#8899BB] prose-li:text-[#8899BB]">
              <ReactMarkdown>{stressResult}</ReactMarkdown>
            </div>
          </div>
        )}

        {tradeResult && (
          <div
            className={`mt-5 p-5 rounded-xl text-sm border ${
              tradeResult.outcome === 'win'
                ? 'bg-[#00D4AA]/10 border-[#00D4AA]/30 text-[#00D4AA]'
                : 'bg-[#FF6B6B]/10 border-[#FF6B6B]/30 text-[#FF6B6B]'
            }`}
          >
            {tradeResult.text}
          </div>
        )}
      </div>
    </div>
  );
}