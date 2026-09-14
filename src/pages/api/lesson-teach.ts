// src/pages/api/lesson-teach.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { callQwenChat, QwenMessage } from '@/lib/ai-server';
import { isRateLimited, clientIp } from '@/lib/rate-limit';

interface LessonSection {
  heading: string;
  body: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (isRateLimited(`lesson-teach:${clientIp(req)}`)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const { lessonTitle, sections, history } = req.body as {
    lessonTitle?: string;
    sections?: LessonSection[];
    history?: ChatMessage[];
  };

  if (!lessonTitle || !Array.isArray(sections) || !Array.isArray(history)) {
    return res
      .status(400)
      .json({ error: 'lessonTitle, sections, and history are all required' });
  }

  const systemPrompt = `You are a friendly trading tutor teaching a lesson called "${lessonTitle}".

Lesson sections (your source of truth):
${sections.map((s) => `- ${s.heading}: ${s.body}`).join('\n')}

Teach interactively:
- Break the concept into short, clear messages (2-3 sentences each)
- Use analogies and real examples
- Encourage questions
- When you've covered all sections, tell the user they're ready for the quiz

Never reveal quiz answers. Keep replies under 100 words. Use markdown.`;

  const messages: QwenMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: (m.role === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: m.text,
    })),
  ];

  try {
    const content = await callQwenChat(messages);
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Lesson teach failed:', error);
    return res.status(200).json({
      content: '⚠️ AI is unavailable right now. You can still take the quiz.',
    });
  }
}