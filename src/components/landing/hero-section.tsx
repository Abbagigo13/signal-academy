import type { CSSProperties, FC, ReactNode } from 'react'

import { Fragment } from 'react'
import { Rocket, ArrowRight } from 'lucide-react'

import { ActionLink } from '@/components/landing/action-link'
import { SignalCard } from '@/components/landing/signal-card'
import { trustSignals } from '@/constants/landing'

/** Above-the-fold stagger, 0.2s between elements. */
const rise = (delay: number) => ({ '--rise-delay': `${delay}ms` }) as CSSProperties

export const HeroSection: FC = (): ReactNode => {
    return (
        <section
            id='hero'
            className='relative flex items-start overflow-hidden px-5 pt-16 pb-20 sm:px-8 lg:min-h-screen lg:items-center lg:pt-32'
        >
            <div
                aria-hidden='true'
                className='aurora-drift absolute -top-40 -left-40 -z-10 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(25,31,97,0.55),transparent_70%)] blur-3xl'
            />

            <div
                aria-hidden='true'
                className='absolute right-0 -bottom-32 -z-10 size-[32rem] rounded-full bg-[radial-gradient(circle,rgba(29,162,180,0.16),transparent_70%)] blur-3xl'
            />

            <div className='mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12'>
                <div className='max-w-2xl'>
                    <span
                        style={rise(0)}
                        className='rise-in inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-signal-bright sm:text-sm'
                    >
                        <Rocket className='size-4' />
                        AI Base Camp Hackathon S2
                    </span>

                    <h1 className='mt-7 text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl'>
                        <span style={rise(200)} className='rise-in block'>
                            Learn Crypto Trading.
                        </span>

                        <span
                            style={rise(400)}
                            className='rise-in text-gradient-signal block pb-1'
                        >
                            Earn While You Learn.
                        </span>
                    </h1>

                    <p
                        style={rise(600)}
                        className='rise-in mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg'
                    >
                        AI-powered signals for crypto AND tokenized US stocks. Learn, paper trade,
                        and earn rewards-all in one platform.
                    
                    </p>

                    <div
                        style={rise(800)}
                        className='rise-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center'
                    >
                        <ActionLink href='/dashboard' size='lg'>
                            Start Learning Free
                            <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
                        </ActionLink>

                        <ActionLink href='#features' variant='outline' size='lg'>
                            View Live Signals
                        </ActionLink>
                    </div>

                    <p
                        style={rise(1000)}
                        className='rise-in mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground'
                    >
                        <span className='text-white/50'>Powered by</span>

                        {trustSignals.map((name, index) => (
                            <Fragment key={name}>
                                {index > 0 && <span aria-hidden='true' className='text-white/25'>·</span>}
                                <span className='font-medium text-muted-foreground'>{name}</span>
                            </Fragment>
                        ))}
                    </p>
                </div>

                <div style={rise(500)} className='rise-in lg:pl-6'>
                    <SignalCard />
                </div>
            </div>
        </section>
    )
}
