import type {
    NavLink,
    MarketSignal,
    Feature,
    Step,
    Stat,
    TechPill,
    SocialLink
} from '@/types'

import {
    Activity,
    Brain,
    Gamepad2,
    KeyRound,
    GraduationCap,
    Award,
    Github,
    Twitter,
    Youtube
} from 'lucide-react'

export const navLinks: NavLink[] = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Tech Stack', href: '#tech-stack' }
]

/**
 * Hero readout. Each signal cycles through its frames on a fixed interval so the
 * card feels live. Frame 0 is what the server renders, so there is no mismatch.
 */
export const marketSignals: MarketSignal[] = [
    {
        id: 'rsi',
        label: 'RSI (14)',
        accent: 'signal',
        frames: [
            { readout: '58.4', strength: 58 },
            { readout: '61.2', strength: 61 },
            { readout: '64.7', strength: 65 },
            { readout: '62.1', strength: 62 }
        ]
    },
    {
        id: 'sentiment',
        label: 'Sentiment',
        accent: 'bright',
        frames: [
            { readout: 'Bullish 72%', strength: 72 },
            { readout: 'Bullish 68%', strength: 68 },
            { readout: 'Bullish 75%', strength: 75 },
            { readout: 'Bullish 70%', strength: 70 }
        ]
    },
    {
        id: 'macd',
        label: 'MACD',
        accent: 'indigo',
        frames: [
            { readout: '+0.42 cross', strength: 64 },
            { readout: '+0.51 cross', strength: 70 },
            { readout: '+0.38 cross', strength: 60 },
            { readout: '+0.47 cross', strength: 67 }
        ]
    },
    {
        id: 'volatility',
        label: 'Volatility',
        accent: 'amber',
        frames: [
            { readout: 'Moderate', strength: 45 },
            { readout: 'Elevated', strength: 58 },
            { readout: 'Moderate', strength: 48 },
            { readout: 'Cooling', strength: 39 }
        ]
    }
]

export const trustSignals: string[] = ['Bitget', 'Qwen AI', 'Arbitrum', 'Solana']

export const features: Feature[] = [
    {
        id: 'live-signals',
        icon: Activity,
        title: 'Live Market Signals',
        description: 'Real-time macro, sentiment, technical, and on-chain data streamed straight from Bitget Signal, so you read the market the way desks do.',
        tag: 'Learn More'
    },
    {
        id: 'ai-tutor',
        icon: Brain,
        title: 'AI Trading Tutor',
        description: 'Learn any concept with a Qwen-powered tutor that explains what each signal means, why it fired, and how a strategy would trade it.',
        tag: 'Learn More'
    },
    {
        id: 'learn-to-earn',
        icon: Gamepad2,
        title: 'Learn-to-Earn',
        description: 'Complete lessons, paper trade the setups you just studied, and turn progress into points, badges, and on-chain recognition.',
        tag: 'Learn More'
    }
]

export const steps: Step[] = [
    {
        id: 'demo-account',
        icon: KeyRound,
        title: 'Create Demo Account',
        description: 'Set up your free Bitget demo API key in under a minute. No deposit, no risk, no card.'
    },
    {
        id: 'learn-practice',
        icon: GraduationCap,
        title: 'Learn & Practice',
        description: 'Work through lessons and paper trade live setups with the AI tutor reading the tape beside you.'
    },
    {
        id: 'earn-rewards',
        icon: Award,
        title: 'Earn Rewards',
        description: 'Unlock badges as your accuracy climbs and earn recognition across the Signal Academy leaderboard.'
    }
]

export const stats: Stat[] = [
    { id: 'signals', value: 5, label: 'Market Signals' },
    { id: 'indicators', value: 23, label: 'Technical Indicators' },
    { id: 'sources', value: 44, label: 'News Sources' },
    { id: 'cost', value: 0, prefix: '$', label: 'Cost to Start' }
]

export const techStack: TechPill[] = [
    { id: 'agent-hub', label: 'Bitget Agent Hub' },
    { id: 'qwen', label: 'Qwen API' },
    { id: 'bitget-signal', label: 'bitget-signal' },
    { id: 'paper-trading', label: 'Paper Trading' },
    { id: 'react', label: 'React' },
    { id: 'node', label: 'Node.js' }
]

export const socialLinks: SocialLink[] = [
    { id: 'github', label: 'GitHub', href: 'https://github.com', icon: Github },
    { id: 'x', label: 'X', href: 'https://x.com', icon: Twitter },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com', icon: Youtube }
]