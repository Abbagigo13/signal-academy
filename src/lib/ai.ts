// src/lib/ai.ts

export async function generateAISummary(marketData: any): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;

  if (!apiKey || apiKey === 'sk-your-qwen-key-here') {
    return '⚠️ Please add your Qwen API key to .env.local';
  }

  const assetType = marketData?.asset?.type || marketData?.technical?.assetType;
  const assetName = marketData?.asset?.name || marketData?.technical?.assetName || 'the asset';
  const ticker = marketData?.asset?.ticker || marketData?.technical?.assetTicker || '';

  const assetDescription =
    assetType === 'stock'
      ? `a tokenized US stock (called an rToken) — ${assetName} (${ticker})`
      : `a cryptocurrency — ${assetName} (${ticker})`;

  try {
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
              content: `You are a senior trading analyst covering both crypto AND tokenized US stocks (rTokens) traded on Bitget.

You are analyzing ${assetDescription}.

Given live market data, provide:
1. A 2-sentence summary of current conditions
2. Two specific trading opportunities with entry reasoning
3. One key risk warning

Keep it under 200 words. Be direct and actionable. Use markdown formatting (bold for key terms, bullet lists).`,
            },
            {
              role: 'user',
              content: JSON.stringify(marketData),
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Qwen API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Analysis Failed:', error);
    return '⚠️ AI analysis temporarily unavailable.';
  }
}

export async function askTutor(
  question: string,
  marketContext?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY;
  if (!apiKey) return '⚠️ Qwen API key missing';

  try {
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
              content: `You are a friendly trading tutor for beginners. You teach BOTH:
- Cryptocurrency trading (BTC, ETH, SOL)
- Tokenized US stocks on Bitget called rTokens (rTSLA, rNVDA, rAAPL, rMSFT, rMETA)

Explain concepts simply, use examples, and encourage learning.
Keep answers under 150 words. Use markdown formatting.
${marketContext ? `Current market context: ${marketContext}` : ''}`,
            },
            { role: 'user', content: question },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Tutor failed:', error);
    return '⚠️ Tutor temporarily unavailable.';
  }
}