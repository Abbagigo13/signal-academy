import type { FC, ReactNode } from 'react'
import type { SignalAccent } from '@/types'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { marketSignals } from '@/constants/landing'

const accents: Record<SignalAccent, { bar: string; text: string }> = {
    signal: { bar: 'from-signal to-signal-bright', text: 'text-signal-bright' },
    bright: { bar: 'from-signal-bright to-[#7BE9F5]', text: 'text-[#7BE9F5]' },
    indigo: { bar: 'from-[#4C63C9] to-[#8FA0F0]', text: 'text-[#9AA9F2]' },
    amber: { bar: 'from-[#C9873A] to-[#F0BE6B]', text: 'text-[#F0BE6B]' }
}

/** Deterministic tape. Index 0 is what renders on the server. */
const priceFrames = ['67,412.80', '67,509.15', '67,684.40', '67,551.90']
const changeFrames = ['+2.41%', '+2.56%', '+2.83%', '+2.62%']

export const SignalCard: FC = (): ReactNode => {
    const [frame, setFrame] = useState(0)
    const [expanded, setExpanded] = useState(false)

    // Let the bars grow in from zero on the first paint.
    useEffect(() => {
        const id = window.requestAnimationFrame(() => setExpanded(true))

        return () => window.cancelAnimationFrame(id)
    }, [])

    // Advance the readout so the card reads as a live feed.
    useEffect(() => {
        const id = window.setInterval(() => setFrame(current => current + 1), 2600)

        return () => window.clearInterval(id)
    }, [])

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
                    </div>

                    <span className='inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-signal-bright uppercase'>
                        <span className='pulse-ring size-1.5 rounded-full bg-signal-bright' />
                        Live
                    </span>
                </div>

                <div className='mt-5 flex items-end gap-3'>
                    <p className='font-mono text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl'>
                        ${priceFrames[frame % priceFrames.length]}
                    </p>

                    <p className='mb-1 inline-flex items-center gap-1 font-mono text-sm font-semibold text-signal-bright tabular-nums'>
                        <TrendingUp className='size-4' />
                        {changeFrames[frame % changeFrames.length]}
                    </p>
                </div>

                <ul className='mt-6 space-y-4'>
                    {marketSignals.map(signal => {
                        const active = signal.frames[frame % signal.frames.length]
                        const accent = accents[signal.accent]

                        return (
                            <li key={signal.id}>
                                <div className='flex items-baseline justify-between gap-4'>
                                    <span className='text-sm font-medium text-muted-foreground'>
                                        {signal.label}
                                    </span>

                                    <span className={cn('font-mono text-sm font-semibold tabular-nums transition-colors duration-500', accent.text)}>
                                        {active.readout}
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
                                        style={{ width: `${expanded ? active.strength : 0}%` }}
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
                            68<span className='text-sm text-muted-foreground'>/100</span>
                        </p>
                    </div>

                    <p className='max-w-[10.5rem] text-right text-xs leading-relaxed text-muted-foreground'>
                        Momentum building. Your tutor has a lesson for this setup.
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