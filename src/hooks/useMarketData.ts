// src/hooks/useMarketData.ts
import { useEffect, useState } from 'react';
import { getMarketInsights, MarketInsights } from '@/lib/signals';
import { generateAISummary } from '@/lib/ai';

export function useMarketData() {
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const data = await getMarketInsights();
    if (!data) {
      setError('Failed to fetch market data');
      setLoading(false);
      return;
    }

    setInsights(data);
    const summary = await generateAISummary(data);
    setAiSummary(summary);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { insights, aiSummary, loading, error, refresh: fetchData };
}