// src/pages/api/tutor.ts
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

  if (isRateLimited(`tutor:${clientIp(req)}`)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const { question, marketContext } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'question is required' });
  }

  try {
    const content = await callQwenChat([
      {
        role: 'system',
        content: `You are a friendly trading tutor for beginners. You teach BOTH:
- Cryptocurrency trading (BTC, ETH, SOL)
- Tokenized US stocks on Bitget called rTokens (rTSLA, rNVDA, rAAPL, rMSFT, rMETA)

Explain concepts simply, use examples, and encourage learning.
Keep answers under 150 words. Use markdown formatting.
${marketContext ? `Current market context: ${marketContext}` : ''}`,
      },
      { role: 'user', content: question },
    ]);

    return res.status(200).json({ content });
  } catch (error) {
    console.error('Tutor failed:', error);
    return res.status(200).json({ content: '⚠️ Tutor temporarily unavailable.' });
  }
}