// src/lib/signals.ts

export interface AssetMeta {
  type: 'crypto' | 'stock';
  ticker: string;
  name: string;
  sector: string | null;
}

export interface TechnicalSignal {
  symbol: string;
  assetName: string;
  assetTicker: string;
  assetType: 'crypto' | 'stock';
  sector: string | null;
  price: string;
  high24h: string;
  low24h: string;
  change24h: string;
  volume24h: string;
  rsi: number;
  signal: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface SentimentSignal {
  fearGreed: number;
  label: string;
  signal: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface MacroSignal {
  trend: string;
  summary: string;
}

export interface OnChainSignal {
  signal: string;
  summary: string;
}

export interface NewsSignal {
  headlines: string[];
  summary: string;
}

export interface MarketInsights {
  source?: string;
  asset?: AssetMeta;
  technical: TechnicalSignal;
  sentiment: SentimentSignal;
  macro: MacroSignal;
  onChain: OnChainSignal;
  news: NewsSignal;
}

export async function getMarketInsights(
  symbol: string = 'BTCUSDT'
): Promise<MarketInsights | null> {
  try {
    const res = await fetch(`/api/signals?symbol=${symbol}`);
    if (!res.ok) throw new Error(`API route failed: ${res.status}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    return data as MarketInsights;
  } catch (error) {
    console.error('Failed to fetch market insights:', error);
    return null;
  }
}