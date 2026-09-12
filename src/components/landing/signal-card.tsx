import type { FC, ReactNode } from 'react'
import type { SignalAccent } from '@/types'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { marketSignals } from '@/constants/landing'

const accents: Record<SignalAccent, { bar: string; text: string }> = {
    signal: { bar: 'from-signal to-signal-bright', text: 'text-signal-bright' },
    bright: { bar: 'from-signal-bright to-[#7BE9F5]', text: 'text-[#7BE9F5]' },
    indigo: { bar: 'from-[#4C63C9] to-[#8FA0F0]', text: 'text-[#9AA9F2]' },
    amber: { bar: 'from-[#C9873A] to-[#F0BE6B]', text: 'text-[#F0BE6B]' }
}

interface LiveSignal {
    price: string
    change24h: string
    rsi: number
    signal: 'Bullish' | 'Bearish' | 'Neutral'
    source: string
}

/** Server-render frame (looks real even before the fetch resolves). */
const FALLBACK: LiveSignal = {
    price: '77,284.56',
    change24h: '-0.46',
    rsi: 47.6,
    signal: 'Neutral',
    source: 'snapshot'
}

/** Build the bar strengths + readouts from live data. */
function buildFrames(data: LiveSignal) {
    const sentiment = data.signal === 'Bullish' ? 72 : data.signal === 'Bearish' ? 30 : 50
    const volatility = Math.min(100, Math.abs(parseFloat(data.change24h)) * 20)

    return {
        'RSI (14)': {
            readout: data.rsi.toFixed(1),
            strength: Math.min(100, Math.max(0, data.rsi))
        },
        Sentiment: {
            readout:
                data.signal === 'Bullish'
                    ? 'Bullish 72%'
                    : data.signal === 'Bearish'
                    ? 'Bearish 30%'
                    : 'Neutral 50%',
            strength: sentiment
        },
        MACD: {
            readout: parseFloat(data.change24h) > 0 ? '+ cross' : '− cross',
            strength: parseFloat(data.change24h) > 0 ? 65 : 35
        },
        Volatility: {
            readout: volatility > 60 ? 'High' : volatility > 30 ? 'Moderate' : 'Cooling',
            strength: Math.max(20, volatility)
        }
    }
}

export const SignalCard: FC = (): ReactNode => {
    const [expanded, setExpanded] = useState(false)
    const [data, setData] = useState<LiveSignal>(FALLBACK)
    const [flash, setFlash] = useState(false)

    // Let the bars grow in from zero on the first paint.
    useEffect(() => {
        const id = window.requestAnimationFrame(() => setExpanded(true))
        return () => window.cancelAnimationFrame(id)
    }, [])

    // Fetch live BTC from our own API
    useEffect(() => {
        let cancelled = false

        async function fetchLive() {
            try {
                const res = await fetch('/api/signals?symbol=BTCUSDT')
                const json = await res.json()

                if (cancelled) return

                const next: LiveSignal = {
                    price: parseFloat(json.technical?.price || '0').toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }),
                    change24h: json.technical?.change24h || '0.00',
                    rsi: json.technical?.rsi || 50,
                    signal: json.technical?.signal || 'Neutral',
                    source: json.source || 'unknown'
                }

                setData(next)
                setFlash(true)
                window.setTimeout(() => setFlash(false), 600)
            } catch {
                // silent — keep fallback
            }
        }

        fetchLive()
        const interval = window.setInterval(fetchLive, 60_000) // refresh every minute

        return () => {
            cancelled = true
            window.clearInterval(interval)
        }
    }, [])

    const changeNum = parseFloat(data.change24h)
    const isUp = changeNum >= 0
    const frames = buildFrames(data)

    return (
        <div className='relative'>
            <div
                aria-hidden='true'
                className='aurora-drift absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(29,162,180,0.28),transparent_65%)] blur-2xl'
            />

            <div className='float-y glass rounded-3xl p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-6'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
                            Bitget Signal
                        </p>

                        <p className='mt-1 font-mono text-sm font-medium text-white'>
                            BTC / USDT
                        </p>

                        <p className='mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/60'>
                            {data.source === 'snapshot'
                                ? 'Snapshot'
                                : data.source === 'bitget-v3'
                                ? 'Bitget v3'
                                : data.source === 'coinmarketcap'
                                ? 'CoinMarketCap'
                                : data.source}
                        </p>
                    </div>

                    <span className='inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-signal-bright uppercase'>
                        <span className='pulse-ring size-1.5 rounded-full bg-signal-bright' />
                        Live
                    </span>
                </div>

                <div className='mt-5 flex items-end gap-3'>
                    <p
                        className={cn(
                            'font-mono text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl transition-colors duration-500',
                            flash && 'text-signal-bright'
                        )}
                    >
                        ${data.price}
                    </p>

                    <p
                        className={cn(
                            'mb-1 inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums',
                            isUp ? 'text-signal-bright' : 'text-[#FF6B6B]'
                        )}
                    >
                        {isUp ? <TrendingUp className='size-4' /> : <TrendingDown className='size-4' />}
                        {isUp ? '+' : ''}
                        {changeNum.toFixed(2)}%
                    </p>
                </div>

                <ul className='mt-6 space-y-4'>
                    {marketSignals.map(signal => {
                        const live = frames[signal.label as keyof typeof frames]
                        const readout = live?.readout ?? ''
                        const strength = live?.strength ?? 0
                        const accent = accents[signal.accent]

                        return (
                            <li key={signal.id}>
                                <div className='flex items-baseline justify-between gap-4'>
                                    <span className='text-sm font-medium text-muted-foreground'>
                                        {signal.label}
                                    </span>

                                    <span
                                        className={cn(
                                            'font-mono text-sm font-semibold tabular-nums transition-colors duration-500',
                                            accent.text
                                        )}
                                    >
                                        {readout}
                                    </span>
                                </div>

                                <div
                                    aria-hidden='true'
                                    className='mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]'
                                >
                                    <div
                                        className={cn(
                                            'h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ease-out',
                                            accent.bar
                                        )}
                                        style={{ width: `${expanded ? strength : 0}%` }}
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div className='mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-white/[0.03] px-4 py-3'>
                    <div>
                        <p className='text-xs text-muted-foreground'>
                            Composite score
                        </p>

                        <p className='font-mono text-lg font-bold text-white tabular-nums'>
                            {Math.round(data.rsi)}
                            <span className='text-sm text-muted-foreground'>/100</span>
                        </p>
                    </div>

                    <p className='max-w-[10.5rem] text-right text-xs leading-relaxed text-muted-foreground'>
                        {data.signal === 'Bullish'
                            ? 'Momentum building. Your tutor has a lesson for this setup.'
                            : data.signal === 'Bearish'
                            ? 'Caution — bearish pressure building. Review risk management.'
                            : 'Neutral conditions. Wait for confirmation before entry.'}
                    </p>
                </div>
            </div>

            <div
                aria-hidden='true'
                className='glass absolute -top-5 -left-6 hidden rounded-2xl px-4 py-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] lg:block'
            >
                <p className='text-[11px] tracking-wider text-muted-foreground uppercase'>
                    Paper P&amp;L
                </p>

                <p className='font-mono text-base font-bold text-signal-bright tabular-nums'>
                    +12.4%
                </p>
            </div>

            <div
                aria-hidden='true'
                className='glass absolute -right-5 -bottom-5 hidden rounded-2xl px-4 py-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] lg:block'
            >
                <p className='text-[11px] tracking-wider text-muted-foreground uppercase'>
                    Badge unlocked
                </p>

                <p className='text-sm font-semibold text-white'>
                    Momentum Reader
                </p>
            </div>
        </div>
    )
}