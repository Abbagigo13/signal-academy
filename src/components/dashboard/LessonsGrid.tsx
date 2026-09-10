// src/components/dashboard/LessonsGrid.tsx
import { useEffect, useState } from 'react';
import {
  ChartLine,
  CandlestickChart,
  Smile,
  Layers,
  Shield,
} from 'lucide-react';
import {
  getLessons,
  saveLessons,
  Lesson,
  getPoints,
  addPoints,
} from '@/lib/storage';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'chart-line': ChartLine,
  'chart-candlestick': CandlestickChart,
  smile: Smile,
  layers: Layers,
  shield: Shield,
};

export default function LessonsGrid() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    setLessons(getLessons());
    setPoints(getPoints());
  }, []);

  const completed = lessons.filter((l) => l.completed).length;
  const progress = lessons.length ? (completed / lessons.length) * 100 : 0;

  const handleComplete = (id: number) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;
    if (lesson.completed) return;

    const updated = lessons.map((l) =>
      l.id === id ? { ...l, completed: true } : l
    );
    setLessons(updated);
    saveLessons(updated);
    addPoints(lesson.reward);
    setPoints(getPoints());
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold mb-2">Your Learning Path</h2>
        <p className="text-[#8899BB] mb-4">
          Complete lessons to earn points and unlock badges.
        </p>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[#1DA2B4] font-semibold">
            {points} points earned
          </span>
          <span className="text-[#8899BB]">
            {completed} / {lessons.length} lessons
          </span>
        </div>
        <div className="h-2 bg-[#131B2E] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#191F61] to-[#1DA2B4] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessons.map((lesson) => {
          const Icon = ICONS[lesson.icon] || ChartLine;
          return (
            <div
              key={lesson.id}
              onClick={() => handleComplete(lesson.id)}
              className={`bg-[#131B2E] border rounded-2xl p-6 transition-all relative ${
                lesson.completed
                  ? 'border-[#00D4AA] cursor-default'
                  : 'border-white/5 hover:border-[#1DA2B4] hover:-translate-y-1 cursor-pointer'
              }`}
            >
              {lesson.completed && (
                <div className="absolute top-4 right-4 w-7 h-7 bg-[#00D4AA] text-[#0A0E1A] rounded-full flex items-center justify-center font-extrabold text-sm">
                  ✓
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">{lesson.title}</h3>
              <p className="text-sm text-[#8899BB] mb-4">{lesson.desc}</p>
              <div className="text-xs font-semibold text-[#1DA2B4]">
                +{lesson.reward} points
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}