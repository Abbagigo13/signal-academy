// src/components/dashboard/AIPanel.tsx
import ReactMarkdown from 'react-markdown';

interface Props {
  summary: string;
  loading: boolean;
}

export default function AIPanel({ summary, loading }: Props) {
  return (
    <div className="bg-[#131B2E] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-robot text-[#1DA2B4]" />
          <h2 className="font-bold">AI Market Analysis</h2>
        </div>
        <span className="px-3 py-1 bg-[#1DA2B4]/15 text-[#1DA2B4] rounded-full text-[11px] font-semibold">
          Powered by Qwen
        </span>
      </div>
      <div className="p-6 text-sm leading-relaxed text-[#8899BB]">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#1DA2B4]/30 border-t-[#1DA2B4] rounded-full animate-spin" />
            Qwen is analyzing live market data...
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-strong:text-[#1DA2B4] prose-p:text-[#8899BB] prose-li:text-[#8899BB] prose-ul:my-2 prose-ol:my-2">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}