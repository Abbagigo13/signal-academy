// src/components/dashboard/LessonModal.tsx
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { Lesson } from '@/lib/lessons';
import { saveLessonProgress, addPoints } from '@/lib/storage';

type Phase = 'teaching' | 'quiz' | 'result';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  lesson: Lesson;
  onClose: () => void;
  onComplete: () => void;
}

export default function LessonModal({ lesson, onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('teaching');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [answers, setAnswers] = useState<number[]>(
    new Array(lesson.quiz.length).fill(-1)
  );
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // Kick off AI teaching when the modal opens
  useEffect(() => {
    teachIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const callQwen = async (history: ChatMessage[]): Promise<string> => {
    try {
      const res = await fetch('/api/lesson-teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          sections: lesson.sections,
          history,
        }),
      });

      if (res.status === 429) {
        return '⚠️ Too many requests. Please wait a moment.';
      }
      if (!res.ok) {
        return '⚠️ AI is unavailable right now. You can still take the quiz.';
      }

      const data = await res.json();
      return (
        data.content ||
        '⚠️ AI is unavailable right now. You can still take the quiz.'
      );
    } catch {
      return '⚠️ Network error. You can still take the quiz.';
    }
  };

  const teachIntro = async () => {
    setThinking(true);
    const intro: ChatMessage = {
      role: 'user',
      text: `Please start teaching me the lesson: ${lesson.title}. Begin with a short intro and the first key concept.`,
    };
    const reply = await callQwen([intro]);
    setMessages([{ role: 'ai', text: reply }]);
    setThinking(false);
  };

  const handleSend = async () => {
    if (!input.trim() || thinking) return;

    const userMsg: ChatMessage = { role: 'user', text: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setThinking(true);

    const reply = await callQwen(next);
    setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    setThinking(false);
  };

  const handleAnswer = (qIndex: number, optIndex: number) => {
    const next = [...answers];
    next[qIndex] = optIndex;
    setAnswers(next);
  };

  const handleSubmit = () => {
    const correct = answers.filter(
      (a, i) => a === lesson.quiz[i].correctIndex
    ).length;
    const pct = Math.round((correct / lesson.quiz.length) * 100);
    const didPass = pct >= 70;

    setScore(pct);
    setPassed(didPass);
    setPhase('result');
    saveLessonProgress(lesson.id, didPass, pct);
    if (didPass) addPoints(lesson.reward);
    onComplete();
  };

  const handleRetry = () => {
    setAnswers(new Array(lesson.quiz.length).fill(-1));
    setScore(0);
    setPassed(false);
    setPhase('quiz');
  };

  const allAnswered = answers.every((a) => a >= 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#131B2E] border border-white/10 w-full sm:max-w-2xl h-[95dvh] sm:h-auto sm:max-h-[90dvh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center flex-shrink-0">
              {phase === 'teaching' ? (
                <BookOpen className="w-4 h-4" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm lg:text-base truncate">
                {lesson.title}
              </h2>
              <p className="text-[11px] text-[#8899BB]">
                {phase === 'teaching'
                  ? 'AI is teaching you'
                  : phase === 'quiz'
                  ? 'Quiz time'
                  : 'Results'}{' '}
                · +{lesson.reward} points
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 text-[#8899BB] hover:text-white flex items-center justify-center flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* TEACHING PHASE */}
          {phase === 'teaching' && (
            <div className="px-5 lg:px-6 py-5 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[90%] ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                      m.role === 'ai'
                        ? 'bg-[#1DA2B4]/15 text-[#1DA2B4]'
                        : 'bg-white/8 text-white'
                    }`}
                  >
                    {m.role === 'ai' ? '🤖' : '👤'}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white whitespace-pre-wrap'
                        : 'bg-[#1A2340]'
                    }`}
                  >
                    {m.role === 'ai' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-strong:text-[#1DA2B4] prose-p:text-[#8899BB] prose-li:text-[#8899BB] prose-p:my-2">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}

              {thinking && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1DA2B4]/15 text-[#1DA2B4] flex items-center justify-center text-xs">
                    🤖
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

              <div ref={chatEndRef} />
            </div>
          )}

          {/* QUIZ PHASE */}
          {phase === 'quiz' && (
            <div className="px-5 lg:px-6 py-5 space-y-6">
              {lesson.quiz.map((q, qIndex) => (
                <div key={qIndex}>
                  <div className="text-xs text-[#8899BB] mb-2">
                    Question {qIndex + 1} of {lesson.quiz.length}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-3">
                    {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(qIndex, optIndex)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          answers[qIndex] === optIndex
                            ? 'border-[#1DA2B4] bg-[#1DA2B4]/15 text-white'
                            : 'border-white/5 bg-[#1A2340] text-[#8899BB] hover:border-white/20'
                        }`}
                      >
                        <span className="font-mono text-xs mr-3 opacity-60">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RESULT PHASE */}
          {phase === 'result' && (
            <div className="px-5 lg:px-6 py-5 text-center">
              {passed ? (
                <CheckCircle2 className="w-16 h-16 text-[#00D4AA] mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-[#FF6B6B] mx-auto mb-4" />
              )}

              <h3 className="text-2xl font-extrabold mb-1">
                {passed ? 'You passed!' : 'Not quite'}
              </h3>

              <p className="text-[#8899BB] text-sm mb-2">
                You scored {score}% ({Math.round((score / 100) * lesson.quiz.length)}{' '}
                of {lesson.quiz.length} correct)
              </p>

              {passed && (
                <div className="inline-block px-4 py-2 bg-[#00D4AA]/15 text-[#00D4AA] rounded-full text-sm font-bold mb-4">
                  +{lesson.reward} points earned
                </div>
              )}

              {!passed && (
                <p className="text-sm text-[#8899BB] mb-4">
                  70% is required to pass. Review and try again.
                </p>
              )}

              <div className="mt-6 space-y-3 text-left">
                {lesson.quiz.map((q, i) => {
                  const isCorrect = answers[i] === q.correctIndex;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${
                        isCorrect
                          ? 'border-[#00D4AA]/30 bg-[#00D4AA]/5'
                          : 'border-[#FF6B6B]/30 bg-[#FF6B6B]/5'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white mb-1">
                            {q.question}
                          </div>
                          <div className="text-[11px] text-[#8899BB] leading-relaxed">
                            {q.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 lg:px-6 py-4 border-t border-white/5 flex-shrink-0">
          {phase === 'teaching' && (
            <div className="space-y-3">
              {/* Chat input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !e.shiftKey && handleSend()
                  }
                  placeholder="Ask a question..."
                  className="flex-1 bg-[#1A2340] border border-white/5 rounded-full px-4 py-2.5 text-sm text-white outline-none focus:border-[#1DA2B4]"
                  disabled={thinking}
                />
                <button
                  onClick={handleSend}
                  disabled={thinking || !input.trim()}
                  className="w-10 h-10 rounded-full bg-[#1DA2B4]/15 text-[#1DA2B4] hover:bg-[#1DA2B4]/25 flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Ready for quiz */}
              <button
                onClick={() => setPhase('quiz')}
                disabled={messages.length < 1}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                I&apos;m ready for the quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {phase === 'quiz' && (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full py-3 rounded-xl bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          )}

          {phase === 'result' && (
            <div className="flex gap-3">
              {!passed && (
                <button
                  onClick={handleRetry}
                  className="flex-1 py-3 rounded-xl bg-[#1A2340] border border-white/5 text-white font-bold flex items-center justify-center gap-2 hover:border-[#1DA2B4]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[#1DA2B4] to-[#148a9a] text-white font-bold"
              >
                {passed ? 'Done' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
