// src/components/dashboard/ChatPanel.tsx
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { askTutor } from '@/lib/ai';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatPanel({
  marketContext,
}: {
  marketContext?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hi! I'm your AI trading tutor. Ask me anything about crypto trading, market signals, or strategy.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askTutor(userMsg, marketContext);
    setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="bg-[#131B2E] border border-white/5 rounded-2xl flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[80%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai'
                  ? 'bg-[#1DA2B4]/15 text-[#1DA2B4]'
                  : 'bg-white/8 text-white'
              }`}
            >
              <i
                className={`fa-solid ${
                  msg.role === 'ai' ? 'fa-robot' : 'fa-user'
                }`}
              />
            </div>
            <div
              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white whitespace-pre-wrap'
                  : 'bg-[#1A2340]'
              }`}
            >
              {msg.role === 'ai' ? (
                <div className="prose prose-invert prose-sm max-w-none prose-strong:text-[#1DA2B4] prose-p:text-[#8899BB] prose-li:text-[#8899BB] prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center">
              <i className="fa-solid fa-robot" />
            </div>
            <div className="px-4 py-3 bg-[#1A2340] rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[#1DA2B4] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#1DA2B4] rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-[#1DA2B4] rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 p-4 border-t border-white/5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about RSI, MACD, or trading strategy..."
          className="flex-1 bg-[#1A2340] border border-white/5 rounded-full px-5 py-3 text-sm text-white outline-none focus:border-[#1DA2B4]"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white hover:scale-105 transition-transform disabled:opacity-50"
        >
          <i className="fa-solid fa-paper-plane" />
        </button>
      </div>
    </div>
  );
}