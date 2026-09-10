// src/pages/api/signals.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = 'https://api.bitget.com';

// Asset registry — crypto + tokenized stocks
type AssetType = 'crypto' | 'stock';

interface AssetInfo {
  name: string;
  ticker: string;
  type: AssetType;
  geckoId?: string; // CoinGecko fallback ID (stock only)
  sector?: string;
}

const ASSET_MAP: Record<string, AssetInfo> = {
  // === CRYPTO ===
  BTCUSDT: { name: 'Bitcoin', ticker: 'BTC', type: 'crypto', geckoId: 'bitcoin' },
  ETHUSDT: { name: 'Ethereum', ticker: 'ETH', type: 'crypto', geckoId: 'ethereum' },
  SOLUSDT: { name: 'Solana', ticker: 'SOL', type: 'crypto', geckoId: 'solana' },

  // === TOKENIZED STOCKS ===
  RTSLAUSDT: { name: 'Tesla', ticker: 'TSLA', type: 'stock', geckoId: 'tesla-xstock', sector: 'Automotive / EV' },
  RNVDAUSDT: { name: 'NVIDIA', ticker: 'NVDA', type: 'stock', geckoId: 'nvidia-xstock', sector: 'Semiconductors' },
  RAAPLUSDT: { name: 'Apple', ticker: 'AAPL', type: 'stock', geckoId: 'apple-xstock', sector: 'Consumer Tech' },
  RMSFTUSDT: { name: 'Microsoft', ticker: 'MSFT', type: 'stock', geckoId: 'microsoft-xstock', sector: 'Software' },
  RMETAUSDT: { name: 'Meta', ticker: 'META', type: 'stock', geckoId: 'meta-xstock', sector: 'Social Media' },
};

async function fetchBitgetTicker(symbol: string) {
  const res = await fetch(
    `${BASE_URL}/api/v2/spot/market/tickers?symbol=${symbol}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SignalAcademy/1.0)',
        Accept: 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error(`Ticker failed: ${res.status}`);
  return res.json();
}

async function fetchBitgetCandles(symbol: string, limit = 100) {
  const res = await fetch(
    `${BASE_URL}/api/v2/spot/market/candles?symbol=${symbol}&granularity=1h&limit=${limit}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SignalAcademy/1.0)',
        Accept: 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error(`Candles failed: ${res.status}`);
  return res.json();
}

function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

async function fetchCoinGeckoFallback(symbol: string, info: AssetInfo) {
  const geckoId = info.geckoId;
  if (!geckoId) throw new Error('No fallback for ' + symbol);

  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd&include_24hr_change=true`,
    { headers: { Accept: 'application/json' } }
  );
  if (!res.ok) throw new Error(`CoinGecko failed: ${res.status}`);
  const data = await res.json();
  return { data: data[geckoId], info };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const symbol = ((req.query.symbol as string) || 'BTCUSDT').toUpperCase();
  const assetInfo: AssetInfo = ASSET_MAP[symbol] || {
    name: symbol,
    ticker: symbol,
    type: 'crypto',
  };

  try {
    // Try Bitget first
    const [tickerData, candlesData] = await Promise.all([
      fetchBitgetTicker(symbol),
      fetchBitgetCandles(symbol, 100),
    ]);

    const ticker = tickerData.data?.[0];
    const candles = candlesData.data || [];

    if (!ticker) throw new Error('No ticker data');

    const closes = candles.map((c: string[]) => parseFloat(c[4])).reverse();
    const rsi = calculateRSI(closes);

    const change24h = parseFloat(ticker.change24h || '0');
    const changePct = (change24h * 100).toFixed(2);

    res.status(200).json({
      source: 'bitget',
      asset: {
        type: assetInfo.type,
        ticker: assetInfo.ticker,
        name: assetInfo.name,
        sector: assetInfo.sector || null,
      },
      technical: {
        symbol,
        assetName: assetInfo.name,
        assetTicker: assetInfo.ticker,
        assetType: assetInfo.type,
        sector: assetInfo.sector || null,
        price: ticker.lastPr,
        high24h: ticker.high24h,
        low24h: ticker.low24h,
        change24h: changePct,
        volume24h: ticker.baseVolume || ticker.quoteVolume,
        rsi,
        signal: rsi > 70 ? 'Bearish' : rsi < 30 ? 'Bullish' : 'Neutral',
      },
      sentiment: {
        fearGreed: Math.round(rsi),
        label:
          rsi > 70
            ? 'Extreme Greed'
            : rsi > 55
            ? 'Greed'
            : rsi > 45
            ? 'Neutral'
            : rsi > 30
            ? 'Fear'
            : 'Extreme Fear',
        signal: rsi > 70 ? 'Bearish' : rsi < 30 ? 'Bullish' : 'Neutral',
      },
      macro: {
        trend: change24h > 0 ? 'Risk-On' : 'Risk-Off',
        summary: `${assetInfo.name} (${assetInfo.ticker}) 24h: ${changePct}% | Price: $${parseFloat(
          ticker.lastPr
        ).toLocaleString()}`,
      },
      onChain: {
        signal: 'Neutral',
        summary:
          assetInfo.type === 'stock'
            ? `Sector: ${assetInfo.sector}`
            : `Market cap tier: ${assetInfo.ticker === 'BTC' ? 'Large' : 'Mid'}`,
      },
      news: {
        headlines: [
          `${assetInfo.ticker} trading at $${parseFloat(
            ticker.lastPr
          ).toLocaleString()}`,
          `24h high: $${parseFloat(ticker.high24h).toLocaleString()}`,
          `24h low: $${parseFloat(ticker.low24h).toLocaleString()}`,
        ],
        summary: `${assetInfo.name} moved ${changePct}% in the last 24 hours.`,
      },
    });
  } catch (bitgetError) {
    console.warn('Bitget failed, trying fallback:', bitgetError);

    try {
      const fallback = await fetchCoinGeckoFallback(symbol, assetInfo);
      const price = fallback.data?.usd || 0;
      const change24h = fallback.data?.usd_24h_change || 0;
      const rsi = Math.max(0, Math.min(100, 50 + change24h * 2));

      res.status(200).json({
        source: 'coingecko-fallback',
        asset: {
          type: assetInfo.type,
          ticker: assetInfo.ticker,
          name: assetInfo.name,
          sector: assetInfo.sector || null,
        },
        technical: {
          symbol,
          assetName: assetInfo.name,
          assetTicker: assetInfo.ticker,
          assetType: assetInfo.type,
          sector: assetInfo.sector || null,
          price: price.toString(),
          high24h: (price * 1.02).toFixed(2),
          low24h: (price * 0.98).toFixed(2),
          change24h: change24h.toFixed(2),
          volume24h: 'N/A',
          rsi,
          signal: rsi > 70 ? 'Bearish' : rsi < 30 ? 'Bullish' : 'Neutral',
        },
        sentiment: {
          fearGreed: Math.round(rsi),
          label:
            rsi > 70
              ? 'Extreme Greed'
              : rsi > 55
              ? 'Greed'
              : rsi > 45
              ? 'Neutral'
              : rsi > 30
              ? 'Fear'
              : 'Extreme Fear',
          signal: rsi > 70 ? 'Bearish' : rsi < 30 ? 'Bullish' : 'Neutral',
        },
        macro: {
          trend: change24h > 0 ? 'Risk-On' : 'Risk-Off',
          summary: `${assetInfo.name} (${assetInfo.ticker}) 24h: ${change24h.toFixed(
            2
          )}% | Price: $${price.toLocaleString()}`,
        },
        onChain: {
          signal: 'Neutral',
          summary:
            assetInfo.type === 'stock'
              ? `Sector: ${assetInfo.sector} (fallback)`
              : `Market cap tier: ${assetInfo.ticker === 'BTC' ? 'Large' : 'Mid'} (fallback)`,
        },
        news: {
          headlines: [
            `${assetInfo.ticker} at $${price.toLocaleString()}`,
            `24h change: ${change24h.toFixed(2)}%`,
          ],
          summary: 'Using CoinGecko fallback due to Bitget API block.',
        },
      });
    } catch (fallbackError) {
      console.error('Both APIs failed:', fallbackError);
      res.status(500).json({
        error: 'All market data sources failed',
        details: String(fallbackError),
      });
    }
  }
}