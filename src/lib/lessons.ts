// src/lib/lessons.ts

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonSection {
  heading: string;
  body: string;
}

export interface Lesson {
  id: number;
  title: string;
  desc: string;
  icon: string;
  reward: number;
  duration: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'What is RSI?',
    desc: 'Understand the Relative Strength Index',
    icon: 'chart-line',
    reward: 10,
    duration: '3 min',
    sections: [
      {
        heading: 'What RSI Measures',
        body: 'RSI (Relative Strength Index) is a momentum indicator that measures how fast and how far price has moved recently. It ranges from 0 to 100. It helps you spot when an asset might be overbought or oversold.',
      },
      {
        heading: 'How to Read It',
        body: 'Above 70 usually means overbought — price may pause or drop. Below 30 usually means oversold — price may bounce. Between 30 and 70 is neutral territory where momentum is balanced.',
      },
      {
        heading: 'How Traders Use It',
        body: 'RSI does not predict direction — it shows recent buying and selling pressure. Always combine it with other tools like price action, volume, and support/resistance. A common default period is 14.',
      },
    ],
    quiz: [
      {
        question: 'What does RSI stand for?',
        options: [
          'Relative Strength Index',
          'Risk Sensitivity Indicator',
          'Rapid Stock Insight',
          'Relative Speed Index',
        ],
        correctIndex: 0,
        explanation:
          'RSI stands for Relative Strength Index — a momentum indicator.',
      },
      {
        question: 'An RSI reading above 70 usually suggests the asset is:',
        options: ['Oversold', 'Overbought', 'Perfectly priced', 'Delisted'],
        correctIndex: 1,
        explanation:
          'Above 70 typically means overbought — buying pressure may be exhausting.',
      },
      {
        question: 'What is a common default period used for RSI?',
        options: ['7', '14', '50', '200'],
        correctIndex: 1,
        explanation:
          'The 14-period RSI is the most common default on most trading platforms.',
      },
    ],
  },
  {
    id: 2,
    title: 'Reading MACD Crosses',
    desc: 'Spot momentum shifts with MACD',
    icon: 'chart-candlestick',
    reward: 15,
    duration: '4 min',
    sections: [
      {
        heading: 'What MACD Is',
        body: 'MACD (Moving Average Convergence Divergence) is a momentum indicator that shows the relationship between two moving averages of price. It consists of the MACD line, the signal line, and a histogram.',
      },
      {
        heading: 'The Signal Line',
        body: 'The MACD line is the difference between the 12-period and 26-period exponential moving averages. The signal line is a 9-period EMA of the MACD line. The two lines crossing is what traders watch.',
      },
      {
        heading: 'Bullish and Bearish Crosses',
        body: 'A bullish cross happens when the MACD line crosses above the signal line — this often signals building upward momentum. A bearish cross happens when the MACD line crosses below the signal line — signaling downward momentum.',
      },
    ],
    quiz: [
      {
        question: 'What does MACD stand for?',
        options: [
          'Market Average Candle Display',
          'Moving Average Convergence Divergence',
          'Mid-Term Asset Change Detector',
          'Multi-Asset Correlation Dashboard',
        ],
        correctIndex: 1,
        explanation:
          'MACD = Moving Average Convergence Divergence.',
      },
      {
        question: 'A bullish MACD cross happens when:',
        options: [
          'The signal line crosses above the MACD line',
          'The MACD line crosses above the signal line',
          'Both lines turn red',
          'The histogram disappears',
        ],
        correctIndex: 1,
        explanation:
          'When MACD crosses above the signal line, momentum is turning bullish.',
      },
      {
        question: 'MACD is best described as what kind of indicator?',
        options: ['Volume', 'Sentiment', 'Momentum', 'Fundamental'],
        correctIndex: 2,
        explanation:
          'MACD is a momentum indicator — it tracks the strength and direction of price movement.',
      },
    ],
  },
  {
    id: 3,
    title: 'Fear & Greed Index',
    desc: 'Gauge market psychology',
    icon: 'smile',
    reward: 10,
    duration: '3 min',
    sections: [
      {
        heading: 'What It Measures',
        body: 'The Fear & Greed Index is a sentiment gauge that measures whether investors are feeling greedy or fearful about the market. It ranges from 0 (extreme fear) to 100 (extreme greed).',
      },
      {
        heading: 'Reading the Scale',
        body: '0-25: Extreme fear — investors are panicking. 25-45: Fear — caution. 45-55: Neutral. 55-75: Greed — confidence building. 75-100: Extreme greed — euphoria, often a warning sign.',
      },
      {
        heading: 'Contrarian Usage',
        body: 'Many experienced traders use it as a contrarian signal. Extreme fear is often when smart money buys. Extreme greed is often when it quietly takes profits. Never use it alone — combine it with price action and technicals.',
      },
    ],
    quiz: [
      {
        question: 'The Fear & Greed Index ranges from:',
        options: ['-100 to 100', '0 to 100', '0 to 10', '1 to 50'],
        correctIndex: 1,
        explanation: 'The index ranges from 0 (extreme fear) to 100 (extreme greed).',
      },
      {
        question: 'A reading of 85 usually means:',
        options: [
          'Extreme Fear',
          'Neutral',
          'Extreme Greed',
          'Market Closed',
        ],
        correctIndex: 2,
        explanation:
          'Above 75 is considered Extreme Greed — often a contrarian warning.',
      },
      {
        question: 'Contrarian traders often:',
        options: [
          'Buy when others are fearful',
          'Follow the crowd',
          'Ignore sentiment entirely',
          'Only trade at noon',
        ],
        correctIndex: 0,
        explanation:
          'Contrarians buy when others are fearful and sell when others are greedy.',
      },
    ],
  },
  {
    id: 4,
    title: 'Support & Resistance',
    desc: 'Find key price levels',
    icon: 'layers',
    reward: 20,
    duration: '5 min',
    sections: [
      {
        heading: 'What Support Is',
        body: 'Support is a price level where a downtrend tends to pause because buyers step in. Think of it as a floor where price bounces off. The more times price has touched and held a level, the stronger the support.',
      },
      {
        heading: 'What Resistance Is',
        body: 'Resistance is a price level where an uptrend tends to pause because sellers step in. Think of it as a ceiling where price struggles to break through. Repeated rejection at a level confirms its strength.',
      },
      {
        heading: 'Role Reversal',
        body: 'When support breaks, it often becomes resistance. When resistance breaks, it often becomes support. This is one of the most reliable patterns in technical analysis — the level does not disappear, it just flips roles.',
      },
    ],
    quiz: [
      {
        question: 'Support is a price level where price tends to:',
        options: [
          'Accelerate upward',
          'Stop falling',
          'Get delisted',
          'Always crash through',
        ],
        correctIndex: 1,
        explanation: 'Support acts as a floor — buyers step in, price stops falling.',
      },
      {
        question: 'Resistance acts as a:',
        options: ['Floor', 'Ceiling', 'Trampoline', 'Random number'],
        correctIndex: 1,
        explanation: 'Resistance is a ceiling where selling pressure pushes price down.',
      },
      {
        question: 'When resistance is broken, it often becomes:',
        options: ['Support', 'Stronger resistance', 'Irrelevant', 'A bull trap'],
        correctIndex: 0,
        explanation:
          'Broken resistance often flips into support — this is role reversal.',
      },
    ],
  },
  {
    id: 5,
    title: 'Risk Management',
    desc: 'Protect your capital',
    icon: 'shield',
    reward: 25,
    duration: '5 min',
    sections: [
      {
        heading: 'The 1% Rule',
        body: 'Professional traders rarely risk more than 1-2% of their total capital on a single trade. This means if you have $1,000, your max loss per trade is $10-$20. This keeps a losing streak from wiping you out.',
      },
      {
        heading: 'Position Sizing',
        body: 'Position size = (Account × Risk %) ÷ (Entry − Stop Loss). This formula tells you exactly how much to trade. Smaller accounts use smaller positions — the math protects you.',
      },
      {
        heading: 'Stop-Loss Placement',
        body: 'Never set stop-losses based on how much money you are willing to lose. Set them based on technical levels — below support, above resistance. If the market hits your level, the trade is wrong — get out and move on.',
      },
    ],
    quiz: [
      {
        question: 'A common rule limits risk per trade to:',
        options: ['10-20%', '1-2%', '50%', 'All of it'],
        correctIndex: 1,
        explanation:
          'Most pros risk 1-2% per trade — small enough to survive losing streaks.',
      },
      {
        question: 'Stop-losses should be placed based on:',
        options: [
          'Emotions',
          'How much money you want to lose',
          'Technical levels',
          'Lunar cycles',
        ],
        correctIndex: 2,
        explanation:
          'Technical levels (support/resistance) tell you when the trade is invalidated.',
      },
      {
        question: 'A 1:3 risk/reward means:',
        options: [
          'Risk 3 to make 1',
          'Risk 1 to potentially make 3',
          'Risk nothing',
          'Only trade 3 times',
        ],
        correctIndex: 1,
        explanation:
          'Risk/reward of 1:3 means you risk $1 to potentially make $3.',
      },
    ],
  },
];