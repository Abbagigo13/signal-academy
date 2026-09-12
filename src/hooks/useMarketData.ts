// src/hooks/useMarketData.ts
import { useEffect, useState, useCallback } from 'react';
import { getMarketInsights, MarketInsights } from '@/lib/signals';
import { generateAISummary } from '@/lib/ai';

export function useMarketData(symbol: string = 'BTCUSDT') {
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log('🎯 [Hook] Fetching data for:', symbol);

    setLoading(true);
    setError(null);
    setInsights(null);
    setAiSummary('');

    const data = await getMarketInsights(symbol);
    if (!data) {
      setError('Failed to fetch market data');
      setLoading(false);
      return;
    }

    setInsights(data);

    const summary = await generateAISummary(data);
    setAiSummary(summary);
    setLoading(false);
  }, [symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    insights,
    aiSummary,
    loading,
    error,
    refresh: fetchData,
    source: insights?.source || null,
  };
}