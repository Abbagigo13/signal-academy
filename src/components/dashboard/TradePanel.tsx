// src/components/dashboard/TradePanel.tsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { askTutor } from '@/lib/ai';
import { saveTrade } from '@/lib/storage';

export default function TradePanel({ insights }: { insights: any }) {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [size, setSize] = useState(100);
  const [stressResult, setStressResult] = useState('');
  const [tradeResult, setTradeResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStressTest = async () => {
    setLoading(true);
    setStressResult('Running stress test...');

    const prompt = `Challenge this trade decision like a risk manager:
Trade: ${side.toUpperCase()} ${symbol} for ${size} SUSDT
Market context: ${JSON.stringify(insights?.technical || {})}

Provide:
1. What could go wrong?
2. Worst-case scenarios
3. Alternative strategies`;

    const response = await askTutor(prompt);
    setStressResult(response);
    setLoading(false);
  };

  const handleExecute = () => {
    const trade = {
      id: Date.now().toString(),
      symbol,
      side,
      size,
      price: 0,
      timestamp: new Date().toISOString(),
    };
    saveTrade(trade);

    setTradeResult(
      `✅ Paper trade placed: ${side.toUpperCase()} ${symbol} for ${size} SUSDT. (Demo mode — no real funds used)`
    );
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
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1DA2B4]/30 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-bolt" />
            Execute Paper Trade
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
          <div className="mt-5 p-5 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-xl text-sm text-[#00D4AA]">
            {tradeResult}
          </div>
        )}
      </div>
    </div>
  );
}