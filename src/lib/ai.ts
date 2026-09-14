// src/lib/ai.ts
// Client-safe. No API key here anymore — calls go through our own
// server routes (/api/ai-summary, /api/tutor), which hold the real key.

export async function generateAISummary(marketData: any): Promise<string> {
  try {
    const res = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketData }),
    });

    if (!res.ok) {
      if (res.status === 429) return '⚠️ Too many requests. Please wait a moment.';
      throw new Error(`API route failed: ${res.status}`);
    }

    const data = await res.json();
    return data.content;
  } catch (error) {
    console.error('AI Analysis Failed:', error);
    return '⚠️ AI analysis temporarily unavailable.';
  }
}

export async function askTutor(
  question: string,
  marketContext?: string
): Promise<string> {
  try {
    const res = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, marketContext }),
    });

    if (!res.ok) {
      if (res.status === 429) return '⚠️ Too many requests. Please wait a moment.';
      throw new Error(`API route failed: ${res.status}`);
    }

    const data = await res.json();
    return data.content;
  } catch (error) {
    console.error('Tutor failed:', error);
    return '⚠️ Tutor temporarily unavailable.';
  }
}