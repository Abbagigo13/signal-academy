# 🎓 Signal Academy

> **Learn crypto and tokenized US stocks. Earn while you learn.**
> AI-powered market signals, an interactive trading tutor, and paper trading — all in one platform.

Built for **Bitget AI Base Camp Hackathon S2** · Theme: *AI × Tokenized US Equities*

---

## ✨ What It Does

Signal Academy is a learn-to-earn trading platform that combines:

- **📊 Live Market Signals** — Real-time macro, technical, sentiment, and on-chain data for 3 cryptocurrencies and 5 tokenized US stocks
- **🧠 AI Trading Tutor** — Chat with a Qwen-powered tutor that teaches trading concepts with live market context
- **📈 Paper Trading** — Place demo trades and get AI-powered stress tests before you commit
- **⚖️ Cross-Asset Comparison** — Compare any two assets (BTC vs rTSLA) side-by-side with AI analysis
- **🎮 Learn-to-Earn** — Complete lessons, unlock badges, earn points
- **👤 Personal Profile** — Track your progress, trades, and achievements

**The 7×24 era — humans sleep, AI agents don't.**

---

## 🎯 Hackathon Theme Alignment

This project directly addresses Bitget's hackathon theme: **AI × tokenized US equities**.

| Hackathon Requirement | How Signal Academy Solves It |
|---|---|
| AI-native experience | Qwen LLM drives all analysis, tutoring, and risk assessment |
| Tokenized US equities | Full support for rTSLA, rNVDA, rAAPL, rMSFT, rMETA |
| 24/7 trading narrative | Signals and AI tutor run nonstop, even when US markets are closed |
| Real utility | Educational platform that teaches beginners before they trade |
| Cross-asset intelligence | AI compares crypto vs tokenized stocks side-by-side |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (Turbopack), React, TypeScript |
| Styling | Tailwind CSS v4 (custom `@theme` with Bitget brand colors) |
| AI | Qwen (Alibaba Cloud Model Studio) via OpenAI-compatible API |
| Market Data | Bitget v3 → CoinMarketCap → Snapshot fallback chain |
| State | `localStorage` (no database — fully client-side) |
| Icons | Lucide React |

---

## 🏗️ Data Fallback System

The app uses a **resilient multi-source** data pipeline that gracefully handles network issues:

1. **Bitget v3 API** — Primary source (rTokens, live prices)
2. **CoinMarketCap Keyless API** — Free fallback for crypto
3. **Snapshot JSON** — Pre-captured real prices for offline/demo use
4. **Deterministic Mock** — Last resort, keeps UI alive

Every API response includes a `source` field so the UI transparently shows where the data came from.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Abbagigo13/signal-academy.git
cd signal-academy
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```bash
QWEN_API_KEY=sk-your-qwen-api-key
NEXT_PUBLIC_PAPER_TRADING=true
```

> `QWEN_API_KEY` is read server-side only (no `NEXT_PUBLIC_` prefix) — it's never bundled into client JS.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```text
signal-academy/
├── src/
│   ├── components/
│   │   ├── dashboard/            # Dashboard views
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── SignalCard.tsx
│   │   │   ├── AIPanel.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── TradePanel.tsx
│   │   │   ├── LessonsGrid.tsx
│   │   │   ├── ProfilePanel.tsx
│   │   │   └── ComparePanel.tsx  # Cross-asset comparison
│   │   ├── landing/               # Landing page sections
│   │   └── generals/              # Shared layout
│   ├── constants/
│   │   └── landing.ts             # Landing page content
│   ├── data/
│   │   └── price-snapshot.json    # Real prices for offline fallback
│   ├── hooks/
│   │   └── useMarketData.ts
│   ├── lib/
│   │   ├── ai.ts                  # Client-side AI helper (calls server routes)
│   │   ├── ai-server.ts           # Server-only Qwen client
│   │   ├── rate-limit.ts          # Per-IP rate limiting for AI routes
│   │   ├── signals.ts             # Market data client
│   │   ├── storage.ts             # localStorage helpers
│   │   └── utils.ts
│   ├── pages/
│   │   ├── api/
│   │   │   ├── signals.ts         # Multi-source market data API
│   │   │   ├── ai-summary.ts      # AI market analysis endpoint
│   │   │   ├── tutor.ts           # AI tutor endpoint
│   │   │   ├── compare.ts         # Cross-asset comparison endpoint
│   │   │   └── lesson-teach.ts    # Interactive lesson teaching endpoint
│   │   ├── dashboard.tsx          # Main dashboard
│   │   └── index.tsx              # Landing page
│   ├── styles/
│   │   └── globals.css            # Tailwind theme + Bitget brand
│   └── types/
│       └── index.ts
├── .env.local                     # API keys (gitignored)
└── package.json
```

---

## 🎨 Brand Colors (Bitget Official)

| Color | Hex | Usage |
|---|---|---|
| Brand Blue | `#191F61` | Primary brand, gradients |
| Turquoise | `#1DA2B4` | Accent, CTAs, highlights |
| Bright Turquoise | `#35D0E2` | Live indicators |
| Surface | `#131B2E` | Card backgrounds |
| Background | `#0A0E1A` | Deep background |

---

## 🎬 Demo Highlights

Once you open the dashboard:

- **Overview** → live market signals + AI analysis + Cross-Asset Comparison
- **AI Tutor** → ask "What is RSI?" or "Explain MACD like I'm 12"
- **Paper Trading** → click "Stress Test with AI" to see the AI challenge your trade
- **Lessons** → complete a lesson to earn points and unlock badges
- **Profile** → see your progress, trades, and achievements

Try switching assets in the dropdown:

- 🪙 **Crypto:** BTC, ETH, SOL
- 📈 **Tokenized Stocks:** rTSLA, rNVDA, rAAPL, rMSFT, rMETA
