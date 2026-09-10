import type { FC, ReactNode } from 'react'
import type { Stat } from '@/types'

import { useEffect, useState } from 'react'

import { Reveal } from '@/components/landing/reveal'
import { useInView } from '@/hooks/use-in-view'
import { stats } from '@/constants/landing'

const DURATION = 1600

/** Counts from zero to the target once the tile scrolls into view. */
const CountUp: FC<{ stat: Stat }> = ({ stat }): ReactNode => {
    const { ref, inView } = useInView<HTMLParagraphElement>({ threshold: 0.4 })
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        if (!inView || stat.value === 0) return

        let frameId = 0
        const start = performance.now()

        const tick = (now: number) => {
            const progress = Math.min((now - start) / DURATION, 1)
            const eased = 1 - Math.pow(1 - progress, 3)

            setDisplay(Math.round(stat.value * eased))

            if (progress < 1) frameId = window.requestAnimationFrame(tick)
        }

        frameId = window.requestAnimationFrame(tick)

        return () => window.cancelAnimationFrame(frameId)
    }, [inView, stat.value])

    return (
        <p
            ref={ref}
            className='font-mono text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl'
        >
            {stat.prefix}
            {display}
        </p>
    )
}

export const StatsSection: FC = (): ReactNode => {
    return (
        <section
            id='stats'
            aria-label='Signal Academy by the numbers'
            className='relative px-5 py-16 sm:px-8 lg:py-20'
        >
            <div className='mx-auto w-full max-w-7xl'>
                <Reveal>
                    <div className='glass relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10'>
                        <div
                            aria-hidden='true'
                            className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent'
                        />

                        <div
                            aria-hidden='true'
                            className='aurora-drift absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(29,162,180,0.16),transparent_70%)] blur-3xl'
                        />

                        <ul className='relative grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4'>
                            {stats.map((stat, index) => (
                                <li key={stat.id}>
                                    <Reveal delay={index * 100} className='text-center'>
                                        <CountUp stat={stat} />

                                        <p className='mt-2 text-sm font-medium text-muted-foreground'>
                                            {stat.label}
                                        </p>
                                    </Reveal>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}