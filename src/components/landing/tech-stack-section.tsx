import type { FC, ReactNode } from 'react'

import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { techStack } from '@/constants/landing'

export const TechStackSection: FC = (): ReactNode => {
    return (
        <section
            id='tech-stack'
            className='relative px-5 py-24 sm:px-8 lg:py-32'
        >
            <div className='mx-auto w-full max-w-7xl'>
                <SectionHeading
                    eyebrow='Tech Stack'
                    title={
                        <>
                            Built on tools that{' '}
                            <span className='text-gradient-signal'>traders trust</span>
                        </>
                    }
                    description='Exchange-grade market data, a frontier language model, and a paper trading engine, glued together with a stack you can actually ship.'
                />

                <ul className='mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-4'>
                    {techStack.map((pill, index) => (
                        <li key={pill.id}>
                            <Reveal delay={index * 80}>
                                <span className='glass inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:-translate-y-1 hover:border-signal/50 hover:shadow-[0_18px_40px_-24px_rgba(29,162,180,0.95)]'>
                                    <span
                                        aria-hidden='true'
                                        className='size-1.5 rounded-full bg-gradient-to-br from-signal-bright to-signal'
                                    />

                                    {pill.label}
                                </span>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}