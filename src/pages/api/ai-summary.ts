// src/pages/api/ai-summary.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { callQwenChat } from '@/lib/ai-server';
import { isRateLimited, clientIp } from '@/lib/rate-limit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (isRateLimited(`ai-summary:${clientIp(req)}`)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const { marketData } = req.body || {};
  if (!marketData) {
    return res.status(400).json({ error: 'marketData is required' });
  }

  const assetType = marketData?.asset?.type || marketData?.technical?.assetType;
  const assetName =
    marketData?.asset?.name || marketData?.technical?.assetName || 'the asset';
  const ticker = marketData?.asset?.ticker || marketData?.technical?.assetTicker || '';

  const assetDescription =
    assetType === 'stock'
      ? `a tokenized US stock (called an rToken) — ${assetName} (${ticker})`
      : `a cryptocurrency — ${assetName} (${ticker})`;

  try {
    const content = await callQwenChat([
      {
        role: 'system',
        content: `You are a senior trading analyst covering both crypto AND tokenized US stocks (rTokens) traded on Bitget.

You are analyzing ${assetDescription}.

Given live market data, provide:
1. A 2-sentence summary of current conditions
2. Two specific trading opportunities with entry reasoning
3. One key risk warning

Keep it under 200 words. Be direct and actionable. Use markdown formatting (bold for key terms, bullet lists).`,
      },
      { role: 'user', content: JSON.stringify(marketData) },
    ]);

    return res.status(200).json({ content });
  } catch (error) {
    console.error('AI Analysis Failed:', error);
    return res.status(200).json({ content: '⚠️ AI analysis temporarily unavailable.' });
  }
}