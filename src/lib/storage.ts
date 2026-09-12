// src/lib/storage.ts

// ============================================
// Lesson progress (NEW)
// ============================================
export interface LessonProgress {
  completed: boolean;
  passed: boolean;
  score: number;
}

export function getLessonProgress(): Record<string, LessonProgress> {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem('lessonProgress') || '{}');
}

export function saveLessonProgress(id: number, passed: boolean, score: number) {
  const progress = getLessonProgress();
  progress[id] = { completed: true, passed, score };
  localStorage.setItem('lessonProgress', JSON.stringify(progress));
}

// ============================================
// Lessons (LEGACY — kept for backward compat)
// ============================================
export interface Lesson {
  id: number;
  title: string;
  desc: string;
  icon: string;
  reward: number;
  completed: boolean;
}

export function getLessons(): Lesson[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('lessons') || '[]');
}

export function saveLessons(lessons: Lesson[]) {
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

// ============================================
// Points
// ============================================
export function getPoints(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('points') || '0');
}

export function addPoints(amount: number) {
  const current = getPoints();
  localStorage.setItem('points', String(current + amount));
}

// ============================================
// Trades
// ============================================
export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  timestamp: string;
}

export function getTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('trades') || '[]');
}

export function saveTrade(trade: Trade) {
  const trades = getTrades();
  trades.push(trade);
  localStorage.setItem('trades', JSON.stringify(trades));
}