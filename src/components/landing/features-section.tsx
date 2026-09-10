import type { FC, ReactNode } from 'react'

import { ArrowRight } from 'lucide-react'

import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { features } from '@/constants/landing'

export const FeaturesSection: FC = (): ReactNode => {
    return (
        <section
            id='features'
            className='relative px-5 py-24 sm:px-8 lg:py-32'
        >
            <div
                aria-hidden='true'
                className='absolute top-1/3 left-1/2 -z-10 size-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(25,31,97,0.4),transparent_70%)] blur-3xl'
            />

            <div className='mx-auto w-full max-w-7xl'>
                <SectionHeading
                    eyebrow='Platform'
                    title={
                        <>
                            Everything a trader needs,{' '}
                            <span className='text-gradient-signal'>in one place</span>
                        </>
                    }
                    description='Signals, tutoring, and practice, wired together so what you learn on Monday is what you trade on Tuesday.'
                />

                <ul className='mt-16 grid gap-6 md:grid-cols-3'>
                    {features.map((feature, index) => (
                        <li key={feature.id}>
                            <Reveal delay={index * 100} className='h-full'>
                                <article className='glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-signal/45 hover:shadow-[0_30px_70px_-40px_rgba(29,162,180,0.9)]'>
                                    <div
                                        aria-hidden='true'
                                        className='absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(circle_at_50%_100%,rgba(29,162,180,0.28),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100'
                                    />

                                    <span className='relative flex size-14 items-center justify-center rounded-2xl border border-signal/25 bg-gradient-to-br from-signal/20 to-brand/30 text-signal-bright transition-transform duration-500 group-hover:scale-110'>
                                        <feature.icon className='size-6' strokeWidth={2} />
                                    </span>

                                    <h3 className='relative mt-6 text-xl font-semibold text-white'>
                                        {feature.title}
                                    </h3>

                                    <p className='relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground'>
                                        {feature.description}
                                    </p>

                                    <span className='relative mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-bright'>
                                        {feature.tag}
                                        <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
                                    </span>
                                </article>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}