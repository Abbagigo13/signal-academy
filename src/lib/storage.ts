// src/lib/storage.ts
export interface Lesson {
  id: number;
  title: string;
  desc: string;
  icon: string;
  reward: number;
  completed: boolean;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  timestamp: string;
}

export function getLessons(): Lesson[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('lessons');
  if (stored) return JSON.parse(stored);

  const defaultLessons: Lesson[] = [
{ id: 1, title: 'What is RSI?', desc: 'Understand the Relative Strength Index', icon: 'chart-line', reward: 10, completed: false },
{ id: 2, title: 'Reading MACD Crosses', desc: 'Spot momentum shifts with MACD', icon: 'chart-candlestick', reward: 15, completed: false },
{ id: 3, title: 'Fear & Greed Index', desc: 'Gauge market psychology', icon: 'smile', reward: 10, completed: false },
{ id: 4, title: 'Support & Resistance', desc: 'Find key price levels', icon: 'layers', reward: 20, completed: false },
{ id: 5, title: 'Risk Management', desc: 'Protect your capital', icon: 'shield', reward: 25, completed: false },
  ];
  localStorage.setItem('lessons', JSON.stringify(defaultLessons));
  return defaultLessons;
}

export function saveLessons(lessons: Lesson[]) {
  localStorage.setItem('lessons', JSON.stringify(lessons));
}

export function getPoints(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('points') || '0');
}

export function addPoints(amount: number) {
  const current = getPoints();
  localStorage.setItem('points', String(current + amount));
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