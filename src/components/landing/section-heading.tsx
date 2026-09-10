import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Reveal } from '@/components/landing/reveal'

interface SectionHeadingProps {
    eyebrow: string
    title: ReactNode
    description?: string
    className?: string
}

export const SectionHeading: FC<SectionHeadingProps> = ({
    eyebrow,
    title,
    description,
    className
}): ReactNode => {
    return (
        <div className={cn('mx-auto max-w-2xl text-center', className)}>
            <Reveal>
                <span className='inline-flex items-center rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-signal-bright uppercase'>
                    {eyebrow}
                </span>
            </Reveal>

            <Reveal delay={100}>
                <h2 className='mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                    {title}
                </h2>
            </Reveal>

            {description && (
                <Reveal delay={200}>
                    <p className='mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg'>
                        {description}
                    </p>
                </Reveal>
            )}
        </div>
    )
}