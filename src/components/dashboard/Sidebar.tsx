// src/components/dashboard/Sidebar.tsx
interface Props {
  currentView: string;
  onNavigate: (view: any) => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
  { id: 'tutor', label: 'AI Tutor', icon: 'fa-brain' },
  { id: 'trade', label: 'Paper Trading', icon: 'fa-arrow-right-arrow-left' },
  { id: 'learn', label: 'Lessons', icon: 'fa-graduation-cap' },
  { id: 'profile', label: 'Profile', icon: 'fa-user' },
];

export default function Sidebar({ currentView, onNavigate }: Props) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#131B2E] border-r border-white/5 flex flex-col z-50">
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-wave-square text-[#1DA2B4] text-xl" />
          <span className="font-extrabold text-[#1DA2B4]">Signal Academy</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentView === item.id
                ? 'bg-[#1DA2B4]/15 text-[#1DA2B4]'
                : 'text-[#8899BB] hover:bg-[#1DA2B4]/8 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-5 border-t border-white/5">
        <div className="bg-gradient-to-br from-[#1DA2B4]/15 to-[#191F61]/30 rounded-xl p-4">
          <div className="text-[11px] text-[#8899BB] uppercase tracking-wider">Paper Balance</div>
          <div className="text-2xl font-extrabold text-[#1DA2B4] mt-1">3,000.00</div>
          <div className="text-xs text-[#8899BB]">SUSDT</div>
        </div>
      </div>
    </aside>
  );
}