// src/components/dashboard/LessonsGrid.tsx
import { useEffect, useState } from 'react';
import {
  ChartLine,
  CandlestickChart,
  Smile,
  Layers,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { LESSONS, Lesson } from '@/lib/lessons';
import {
  getLessonProgress,
  getPoints,
  LessonProgress,
} from '@/lib/storage';
import LessonModal from '@/components/dashboard/LessonModal';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'chart-line': ChartLine,
  'chart-candlestick': CandlestickChart,
  smile: Smile,
  layers: Layers,
  shield: Shield,
};

export default function LessonsGrid() {
  const [points, setPoints] = useState(0);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const refresh = () => {
    setPoints(getPoints());
    setProgress(getLessonProgress());
  };

  useEffect(() => {
    refresh();
  }, []);

  const completed = Object.values(progress).filter((p) => p.passed).length;
  const total = LESSONS.length;
  const progressPct = total ? (completed / total) * 100 : 0;

  return (
    <>
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold mb-2">Your Learning Path</h2>
          <p className="text-[#8899BB] mb-4">
            Read the lesson, pass the quiz, earn points and unlock badges.
          </p>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#1DA2B4] font-semibold">
              {points} points earned
            </span>
            <span className="text-[#8899BB]">
              {completed} / {total} lessons passed
            </span>
          </div>
          <div className="h-2 bg-[#131B2E] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#191F61] to-[#1DA2B4] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LESSONS.map((lesson) => {
            const Icon = ICONS[lesson.icon] || ChartLine;
            const prog = progress[lesson.id];
            const isPassed = prog?.passed;
            const isFailed = prog && !prog.passed;

            return (
              <div
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`bg-[#131B2E] border rounded-2xl p-6 transition-all cursor-pointer relative hover:-translate-y-1 ${
                  isPassed
                    ? 'border-[#00D4AA]'
                    : isFailed
                    ? 'border-[#FF6B6B]/40'
                    : 'border-white/5 hover:border-[#1DA2B4]'
                }`}
              >
                {isPassed && (
                  <div className="absolute top-4 right-4 w-7 h-7 bg-[#00D4AA] text-[#0A0E1A] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    isPassed
                      ? 'bg-[#00D4AA]/15 text-[#00D4AA]'
                      : 'bg-[#1DA2B4]/15 text-[#1DA2B4]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-bold mb-2">{lesson.title}</h3>
                <p className="text-sm text-[#8899BB] mb-4">{lesson.desc}</p>

                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-[#1DA2B4]">
                    +{lesson.reward} points
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#8899BB]">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </div>
                </div>

                {isPassed && prog.score && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-[#00D4AA]">
                    Passed · {prog.score}% score
                  </div>
                )}

                {isFailed && prog.score && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-[#FF6B6B]">
                    Last attempt: {prog.score}% — try again
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onComplete={refresh}
        />
      )}
    </>
  );
}