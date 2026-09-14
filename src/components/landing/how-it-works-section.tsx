import type { FC, ReactNode } from 'react'

import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { ActionLink } from '@/components/landing/action-link'
import { steps } from '@/constants/landing'

export const HowItWorksSection: FC = (): ReactNode => {
    return (
        <section
            id='how-it-works'
            className='relative px-5 py-24 sm:px-8 lg:py-32'
        >
            <div className='mx-auto w-full max-w-7xl'>
                <SectionHeading
                    eyebrow='How It Works'
                    title={
                        <>
                            From zero to <span className='text-gradient-signal'>first trade</span> in
                            three steps
                        </>
                    }
                    description='No deposit, no risk. Everything runs on a Bitget demo account until you decide otherwise.'
                />

                <ol className='mx-auto mt-20 grid max-w-5xl gap-14 md:grid-cols-3 md:gap-8'>
                    {steps.map((step, index) => {
                        const isFinal = index === steps.length - 1
                        const ringOpacity = ['border-signal/25', 'border-signal/45', 'border-signal-bright/80'][index] ?? 'border-signal/40'
                        const iconOpacity = ['text-signal-bright/60', 'text-signal-bright/85', 'text-signal-bright'][index] ?? 'text-signal-bright'
                        const shadowClass = isFinal
                            ? 'shadow-[0_0_0_8px_rgba(10,14,26,1),0_0_35px_-4px_rgba(53,208,226,0.65),0_18px_45px_-25px_rgba(29,162,180,0.9)]'
                            : 'shadow-[0_0_0_8px_rgba(10,14,26,1),0_18px_45px_-25px_rgba(29,162,180,0.9)]'

                        return (
                            <li key={step.id} className='relative'>
                                {/* Connector: vertical between stacked steps, horizontal on desktop. */}
                                {index < steps.length - 1 && (
                                    <span
                                        aria-hidden='true'
                                        className='line-flow-y md:line-flow absolute top-full left-1/2 h-14 w-px -translate-x-1/2 md:top-10 md:left-[calc(50%+3rem)] md:h-px md:w-[calc(100%-4rem)] md:translate-x-0'
                                    />
                                )}

                                <Reveal delay={index * 150} className='relative flex flex-col items-center text-center'>
                                    <span
                                        className={`relative flex size-20 items-center justify-center rounded-full border-2 bg-background ${ringOpacity} ${shadowClass}`}
                                    >
                                        <span
                                            aria-hidden='true'
                                            className={`absolute inset-1.5 rounded-full bg-gradient-to-br ${
                                                isFinal ? 'from-signal/35 to-brand/50' : 'from-signal/20 to-brand/35'
                                            }`}
                                        />

                                        <step.icon className={`relative size-7 ${iconOpacity}`} strokeWidth={2} />

                                        <span className='absolute -top-1 -right-1 flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-signal-bright to-signal font-mono text-xs font-bold text-[#04121A]'>
                                            {index + 1}
                                        </span>
                                    </span>

                                    <h3 className={`mt-7 text-xl font-semibold ${isFinal ? 'text-white' : 'text-white/90'}`}>
                                        {step.title}
                                    </h3>

                                    <p className='mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground'>
                                        {step.description}
                                    </p>
                                </Reveal>
                            </li>
                        )
                    })}
                </ol>

                <Reveal delay={200} className='mt-16 flex justify-center'>
                    <ActionLink href='/dashboard' size='lg'>
                        Create Your Demo Account
                    </ActionLink>
                </Reveal>
            </div>
        </section>
    )
}
