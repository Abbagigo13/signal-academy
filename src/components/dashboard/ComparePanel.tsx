// src/components/dashboard/ComparePanel.tsx
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GitCompare, Sparkles, ChevronDown } from 'lucide-react';
import { getMarketInsights } from '@/lib/signals';

interface Asset {
  symbol: string;
  label: string;
  type: 'crypto' | 'stock';
}

const ASSETS: Asset[] = [
  { symbol: 'BTCUSDT', label: 'BTC / Bitcoin', type: 'crypto' },
  { symbol: 'ETHUSDT', label: 'ETH / Ethereum', type: 'crypto' },
  { symbol: 'SOLUSDT', label: 'SOL / Solana', type: 'crypto' },
  { symbol: 'RTSLAUSDT', label: 'rTSLA / Tesla', type: 'stock' },
  { symbol: 'RNVDAUSDT', label: 'rNVDA / NVIDIA', type: 'stock' },
  { symbol: 'RAAPLUSDT', label: 'rAAPL / Apple', type: 'stock' },
  { symbol: 'RMSFTUSDT', label: 'rMSFT / Microsoft', type: 'stock' },
  { symbol: 'RMETAUSDT', label: 'rMETA / Meta', type: 'stock' },
];

export default function ComparePanel() {
  const [assetA, setAssetA] = useState('BTCUSDT');
  const [assetB, setAssetB] = useState('RTSLAUSDT');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (assetA === assetB) {
      setError('Please select two different assets.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      // Fetch both assets in parallel
      const [dataA, dataB] = await Promise.all([
        getMarketInsights(assetA),
        getMarketInsights(assetB),
      ]);

      if (!dataA || !dataB) {
        setError('Failed to fetch one or both assets.');
        setLoading(false);
        return;
      }

      // Call AI to compare
      const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;
      if (!apiKey) {
        setError('Qwen API key missing.');
        setLoading(false);
        return;
      }

      const prompt = `Compare these two assets side-by-side for a trader:

ASSET A: ${assetA}
${JSON.stringify(dataA, null, 2)}

ASSET B: ${assetB}
${JSON.stringify(dataB, null, 2)}

Provide:
1. **Head-to-Head** — which is trending better and why
2. **Correlation** — are they moving together, diverging, or uncorrelated?
3. **Risk/Reward** — which offers a better setup right now?
4. **Concrete Trade Idea** — one specific trade (long one, short the other, or wait)

Use markdown formatting. Keep it under 250 words. Be direct and actionable.`;

      const response = await fetch(
        'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen-plus',
            messages: [
              {
                role: 'system',
                content:
                  'You are a senior cross-asset analyst. Compare assets objectively and give actionable trade ideas.',
              },
              { role: 'user', content: prompt },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        setResult(data.choices[0].message.content);
      } else {
        setError('AI returned an unexpected response.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-[#1DA2B4]" />
          <h2 className="font-bold">Cross-Asset Comparison</h2>
        </div>
        <span className="px-3 py-1 bg-[#1DA2B4]/15 text-[#1DA2B4] rounded-full text-[11px] font-semibold">
          AI-Powered
        </span>
      </div>

      <div className="p-6">
        {/* Asset Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end mb-5">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold block mb-2">
              Asset A
            </label>
            <div className="relative">
              <select
                value={assetA}
                onChange={(e) => setAssetA(e.target.value)}
                className="w-full appearance-none bg-[#1A2340] border border-white/5 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-white outline-none focus:border-[#1DA2B4] cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <optgroup label="🪙 Crypto" className="bg-[#1A2340] text-[#8899BB]">
                  {ASSETS.filter((a) => a.type === 'crypto').map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#1A2340] text-white">
                      {a.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📈 Tokenized Stocks" className="bg-[#1A2340] text-[#8899BB]">
                  {ASSETS.filter((a) => a.type === 'stock').map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#1A2340] text-white">
                      {a.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-[#8899BB] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-center pb-3">
            <span className="text-[#8899BB] font-bold text-sm">VS</span>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-[#8899BB] font-semibold block mb-2">
              Asset B
            </label>
            <div className="relative">
              <select
                value={assetB}
                onChange={(e) => setAssetB(e.target.value)}
                className="w-full appearance-none bg-[#1A2340] border border-white/5 rounded-xl px-4 py-3 pr-10 text-sm font-semibold text-white outline-none focus:border-[#1DA2B4] cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <optgroup label="🪙 Crypto" className="bg-[#1A2340] text-[#8899BB]">
                  {ASSETS.filter((a) => a.type === 'crypto').map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#1A2340] text-white">
                      {a.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📈 Tokenized Stocks" className="bg-[#1A2340] text-[#8899BB]">
                  {ASSETS.filter((a) => a.type === 'stock').map((a) => (
                    <option key={a.symbol} value={a.symbol} className="bg-[#1A2340] text-white">
                      {a.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-[#8899BB] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Compare Button */}
        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1DA2B4]/30 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'AI is comparing...' : 'Compare with AI'}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-5 p-5 bg-[#1A2340] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 border-2 border-[#1DA2B4]/30 border-t-[#1DA2B4] rounded-full animate-spin" />
              <span className="text-sm text-[#8899BB]">
                Analyzing {assetA} vs {assetB}...
              </span>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="mt-5 p-6 bg-[#1A2340] rounded-xl">
            <div className="flex items-center gap-2 text-[#1DA2B4] font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              AI Analysis · {assetA} vs {assetB}
            </div>
            <div className="prose prose-invert prose-sm max-w-none prose-strong:text-[#1DA2B4] prose-p:text-[#8899BB] prose-li:text-[#8899BB] prose-headings:text-white prose-headings:text-sm prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}