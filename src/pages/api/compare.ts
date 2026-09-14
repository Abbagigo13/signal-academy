// src/pages/api/compare.ts
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

  if (isRateLimited(`compare:${clientIp(req)}`)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const { assetA, assetB, dataA, dataB } = req.body || {};
  if (!assetA || !assetB || !dataA || !dataB) {
    return res.status(400).json({ error: 'assetA, assetB, dataA, dataB are all required' });
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

  try {
    const content = await callQwenChat([
      {
        role: 'system',
        content:
          'You are a senior cross-asset analyst. Compare assets objectively and give actionable trade ideas.',
      },
      { role: 'user', content: prompt },
    ]);

    return res.status(200).json({ content });
  } catch (error) {
    console.error('Compare failed:', error);
    return res.status(200).json({ error: 'AI returned an unexpected response.' });
  }
}