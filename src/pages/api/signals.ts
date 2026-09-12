// src/pages/api/signals.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://api.bitget.com';
const CMC_URL =
  'https://pro-api.coinmarketcap.com/public-api/v3/cryptocurrency/quotes/latest';

type AssetType = 'crypto' | 'stock';

interface AssetInfo {
  name: string;
  ticker: string;
  type: AssetType;
  cmcId?: string;
  sector?: string;
}

const ASSET_MAP: Record<string, AssetInfo> = {
  BTCUSDT: { name: 'Bitcoin', ticker: 'BTC', type: 'crypto', cmcId: '1' },
  ETHUSDT: { name: 'Ethereum', ticker: 'ETH', type: 'crypto', cmcId: '1027' },
  SOLUSDT: { name: 'Solana', ticker: 'SOL', type: 'crypto', cmcId: '5426' },
  RTSLAUSDT: { name: 'Tesla', ticker: 'TSLA', type: 'stock', sector: 'Automotive / EV' },
  RNVDAUSDT: { name: 'NVIDIA', ticker: 'NVDA', type: 'stock', sector: 'Semiconductors' },
  RAAPLUSDT: { name: 'Apple', ticker: 'AAPL', type: 'stock', sector: 'Consumer Tech' },
  RMSFTUSDT: { name: 'Microsoft', ticker: 'MSFT', type: 'stock', sector: 'Software' },
  RMETAUSDT: { name: 'Meta', ticker: 'META', type: 'stock', sector: 'Social Media' },
};

// ============================================
// Cache (30s TTL)
// ============================================
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 30_000;

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// Snapshot loader (strips BOM)
// ============================================
interface SnapshotEntry {
  price: number;
  volume24h: number;
  change24h: number;
  ticker?: string;
  source?: string;
}

let snapshotCache: Record<string, SnapshotEntry> | null = null;

function loadSnapshot(): Record<string, SnapshotEntry> | null {
  if (snapshotCache) return snapshotCache;

  try {
    const snapshotPath = path.join(
      process.cwd(),
      'src',
      'data',
      'price-snapshot.json'
    );

    if (!fs.existsSync(snapshotPath)) {
      console.warn('⚠️ [Snapshot] File not found:', snapshotPath);
      return null;
    }

    let raw = fs.readFileSync(snapshotPath, 'utf-8');

    // Strip BOM if present
    if (raw.charCodeAt(0) === 0xfeff) {
      raw = raw.slice(1);
    }

    snapshotCache = JSON.parse(raw);
    console.log(
      '✅ [Snapshot] Loaded:',
      Object.keys(snapshotCache || {}).join(', ')
    );
    return snapshotCache;
  } catch (err) {
    console.error('❌ [Snapshot] Load failed:', String(err));
    return null;
  }
}

// ============================================
// Bitget v3 fetchers
// ============================================
async function fetchBitgetV3Ticker(symbol: string) {
  const url = `${BASE_URL}/api/v3/market/tickers?category=SPOT&symbol=${symbol}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SignalAcademy/1.0)',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`v3 ticker failed: ${res.status}`);
    const json = await res.json();
    const item = json.data?.[0] || json.data;
    if (!item) throw new Error('v3 ticker: no data');

    return {
      symbol: item.symbol || symbol,
      lastPr: item.lastPrice || item.lastPr || item.close || '0',
      high24h: item.highPrice24h || item.high24h || '0',
      low24h: item.lowPrice24h || item.low24h || '0',
      change24h: item.priceChangePercent24h || item.change24h || '0',
      baseVolume: item.volume24h || item.baseVolume || '0',
      quoteVolume: item.turnover24h || item.quoteVolume || '0',
      isRwa: item.isRwa || 'NO',
      symbolType: item.symbolType || 'crypto',
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function fetchBitgetV3Candles(symbol: string, limit = 100) {
  const url = `${BASE_URL}/api/v3/market/candles?category=SPOT&symbol=${symbol}&interval=1H&limit=${limit}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SignalAcademy/1.0)',
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`v3 candles failed: ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ============================================
// CoinMarketCap fetcher with retry
// ============================================
async function fetchCoinMarketCap(cmcId: string) {
  const url = `${CMC_URL}?id=${cmcId}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    console.log(`🔍 [CMC] Attempt ${attempt} for id=${cmcId}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SignalAcademy/1.0)',
        },
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`CMC HTTP ${res.status}`);

      const json = await res.json();
      const coin = json.data?.[0];
      const quote = coin?.quote?.[0];

      if (!coin || !quote) throw new Error('CMC: no data');

      console.log(`✅ [CMC] Succeeded on attempt ${attempt}`);

      return {
        price: quote.price || 0,
        volume24h: quote.volume_24h || 0,
        change24h: quote.percent_change_24h || 0,
        high24h: quote.price * 1.02,
        low24h: quote.price * 0.98,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`❌ [CMC] Attempt ${attempt} failed: ${String(err)}`);
      if (attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  throw new Error('CMC failed after retries');
}

// ============================================
// RSI calculation
// ============================================
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

// ============================================
// Response builders
// ============================================
interface BuildParams {
  symbol: string;
  assetInfo: AssetInfo;
  source: string;
  price: number;
  change24h: number;
  rsi: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  isRwa?: string;
  symbolType?: string;
}

function buildResponse(params: BuildParams) {
  const {
    symbol,
    assetInfo,
    source,
    price,
    change24h,
    rsi,
    high24h,
    low24h,
    volume24h,
    isRwa,
    symbolType,
  } = params;

  const changePct = change24h.toFixed(2);

  return {
    source,
    bitgetReachable: source.startsWith('bitget'),
    asset: {
      type: assetInfo.type,
      ticker: assetInfo.ticker,
      name: assetInfo.name,
      sector: assetInfo.sector || null,
      isRwa: isRwa || null,
      symbolType: symbolType || null,
    },
    technical: {
      symbol,
      assetName: assetInfo.name,
      assetTicker: assetInfo.ticker,
      assetType: assetInfo.type,
      sector: assetInfo.sector || null,
      price: price.toString(),
      high24h: high24h.toString(),
      low24h: low24h.toString(),
      change24h: changePct,
      volume24h,
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
      summary: `${assetInfo.name} (${assetInfo.ticker}) 24h: ${changePct}% | Price: $${price.toLocaleString()}`,
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
        `${assetInfo.ticker} trading at $${price.toLocaleString()}`,
        `24h high: $${high24h.toLocaleString()}`,
        `24h low: $${low24h.toLocaleString()}`,
      ],
      summary: `${assetInfo.name} moved ${changePct}% in the last 24 hours.`,
    },
  };
}

// ============================================
// Snapshot-based response (crypto + stocks)
// ============================================
function buildSnapshotResponse(symbol: string, assetInfo: AssetInfo) {
  const snapshot = loadSnapshot();
  const entry = snapshot?.[symbol];

  if (!entry || !entry.price) return null;

  const rsi = Math.max(0, Math.min(100, 50 + entry.change24h * 2));

  return buildResponse({
    symbol,
    assetInfo,
    source: entry.source === 'yahoo-snapshot' ? 'yahoo-snapshot' : 'snapshot',
    price: entry.price,
    change24h: entry.change24h,
    rsi,
    high24h: entry.price * 1.02,
    low24h: entry.price * 0.98,
    volume24h: entry.volume24h.toLocaleString(),
  });
}

// ============================================
// Mock response
// ============================================
function buildMockResponse(symbol: string, assetInfo: AssetInfo) {
  const seed = assetInfo.ticker
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0);

  const mockPrice =
    assetInfo.type === 'stock' ? 100 + (seed % 400) : 20000 + (seed % 60000);

  const mockChange = ((seed % 60) - 30) / 10;
  const mockRsi = 45 + (seed % 20);

  return buildResponse({
    symbol,
    assetInfo,
    source: 'mock',
    price: mockPrice,
    change24h: mockChange,
    rsi: mockRsi,
    high24h: mockPrice * 1.02,
    low24h: mockPrice * 0.98,
    volume24h: 'N/A',
  });
}

// ============================================
// Build Bitget payload
// ============================================
async function buildBitgetPayload(
  symbol: string,
  assetInfo: AssetInfo,
  source: string
) {
  const [ticker, candles] = await Promise.all([
    fetchBitgetV3Ticker(symbol),
    fetchBitgetV3Candles(symbol, 100),
  ]);

  const closes = (candles.data || [])
    .map((c: string[]) => parseFloat(c[4]))
    .reverse();
  const rsi = calculateRSI(closes);

  return buildResponse({
    symbol,
    assetInfo,
    source,
    price: parseFloat(ticker.lastPr),
    change24h: parseFloat(ticker.change24h),
    rsi,
    high24h: parseFloat(ticker.high24h),
    low24h: parseFloat(ticker.low24h),
    volume24h: ticker.baseVolume || ticker.quoteVolume || 'N/A',
    isRwa: ticker.isRwa,
    symbolType: ticker.symbolType,
  });
}

// ============================================
// Build CoinMarketCap payload
// ============================================
async function buildCoinMarketCapPayload(
  symbol: string,
  assetInfo: AssetInfo
) {
  if (!assetInfo.cmcId) throw new Error('No CMC ID for ' + symbol);

  const cmc = await fetchCoinMarketCap(assetInfo.cmcId);
  const rsi = Math.max(0, Math.min(100, 50 + cmc.change24h * 2));

  return buildResponse({
    symbol,
    assetInfo,
    source: 'coinmarketcap',
    price: cmc.price,
    change24h: cmc.change24h,
    rsi,
    high24h: cmc.high24h,
    low24h: cmc.low24h,
    volume24h: cmc.volume24h.toLocaleString(),
  });
}

// ============================================
// Main handler
// ============================================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const symbol = ((req.query.symbol as string) || 'BTCUSDT').toUpperCase();

  const cached = getCached(symbol);
  if (cached) {
    console.log('✅ [API] Cache hit for', symbol);
    return res.status(200).json(cached);
  }

  console.log('\n========================================');
  console.log('🔍 [API] Requested symbol:', symbol);
  console.log('========================================\n');

  const assetInfo: AssetInfo = ASSET_MAP[symbol] || {
    name: symbol,
    ticker: symbol,
    type: 'crypto',
  };

  // Build parallel sources
  const sources: Array<{ name: string; promise: Promise<any> }> = [];

  sources.push({
    name: 'bitget-v3',
    promise: buildBitgetPayload(symbol, assetInfo, 'bitget-v3'),
  });

  if (assetInfo.cmcId) {
    sources.push({
      name: 'coinmarketcap',
      promise: buildCoinMarketCapPayload(symbol, assetInfo),
    });
  }

  // Race all sources
  const results = await Promise.allSettled(sources.map((s) => s.promise));

  let successPayload: any = null;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const name = sources[i].name;

    if (result.status === 'fulfilled') {
      console.log(`✅ [API] ${name} succeeded`);
      if (!successPayload) successPayload = result.value;
    } else {
      console.warn(`❌ [API] ${name} failed:`, String(result.reason));
    }
  }

  if (successPayload) {
    console.log(`✅ [API] Returning payload from: ${successPayload.source}`);
    setCache(symbol, successPayload);
    return res.status(200).json(successPayload);
  }

  // Fallback 1: Snapshot
  const snapshotPayload = buildSnapshotResponse(symbol, assetInfo);
  if (snapshotPayload) {
    console.log(`📸 [API] Using snapshot for ${symbol}`);
    setCache(symbol, snapshotPayload);
    return res.status(200).json(snapshotPayload);
  }

  // Fallback 2: Mock
  const payload = buildMockResponse(symbol, assetInfo);
  setCache(symbol, payload);
  console.log(`⚠️ [API] Using mock for ${symbol}`);
  return res.status(200).json(payload);
}