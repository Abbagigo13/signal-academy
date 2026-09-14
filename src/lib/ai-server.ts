// src/lib/ai-server.ts
// Server-only. Do NOT import this from any component or client-side hook —
// it reads a private API key that must never reach the browser bundle.

export interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callQwenChat(
  messages: QwenMessage[],
  options: { model?: string } = {}
): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('ai-server.ts is server-only and must not be called from client code.');
  }

  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error('QWEN_API_KEY is not configured on the server.');
  }

  const response = await fetch(
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'qwen-plus',
        messages,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Qwen API error (${response.status})`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Qwen API returned an empty response.');
  }
  return content;
}