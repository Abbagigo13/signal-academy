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
  entryPrice?: number;
  exitPrice?: number;
  pnl?: number;
  pnlPercent?: number;
  balanceAfter?: number;
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

// ============================================
// Paper trading balance
// ============================================
export const STARTING_BALANCE = 3000;
const BALANCE_EVENT = 'signal-academy:balance-updated';

export function getBalance(): number {
  if (typeof window === 'undefined') return STARTING_BALANCE;
  const stored = localStorage.getItem('balance');
  if (stored === null) {
    localStorage.setItem('balance', String(STARTING_BALANCE));
    return STARTING_BALANCE;
  }
  return parseFloat(stored);
}

export function setBalance(amount: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('balance', String(amount));
  window.dispatchEvent(new Event(BALANCE_EVENT));
}

/** Adds `delta` (positive or negative) to the stored balance and returns the new value. */
export function adjustBalance(delta: number): number {
  const next = getBalance() + delta;
  setBalance(next);
  return next;
}

/** Subscribe to balance changes made anywhere in the app (any tab/component). Returns an unsubscribe fn. */
export function onBalanceChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(BALANCE_EVENT, callback);
  window.addEventListener('storage', callback); // cross-tab
  return () => {
    window.removeEventListener(BALANCE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}