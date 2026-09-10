// src/components/dashboard/Topbar.tsx
interface Props {
  title: string;
  connected: boolean;
  loading: boolean;
  onRefresh: () => void;
}

export default function Topbar({ title, connected, loading, onRefresh }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0E1A] py-6 border-b border-white/5 mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <div className="flex items-center gap-2 mt-1 text-xs text-[#8899BB]">
          <i
            className={`fa-solid fa-circle text-[8px] ${
              loading ? 'text-yellow-500' : connected ? 'text-[#00D4AA]' : 'text-red-500'
            }`}
          />
          {loading ? 'Fetching signals...' : connected ? 'Live · Connected' : 'Connection error'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-10 h-10 rounded-xl bg-[#131B2E] border border-white/5 text-[#8899BB] hover:text-[#1DA2B4] hover:border-[#1DA2B4] transition-all disabled:opacity-50"
        >
          <i className={`fa-solid fa-rotate ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#131B2E] rounded-full text-sm font-medium">
          <i className="fa-solid fa-user-astronaut text-[#1DA2B4]" />
          Learner
        </div>
      </div>
    </header>
  );
}