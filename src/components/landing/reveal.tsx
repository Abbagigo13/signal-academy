import type { CSSProperties, FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'

interface RevealProps {
    children: ReactNode
    /** Stagger in milliseconds, applied as a CSS transition delay. */
    delay?: number
    className?: string
}

/**
 * Fade-and-rise wrapper driven by the Intersection Observer API.
 * The motion itself lives in globals.css (`.reveal`) so it can be disabled
 * wholesale under `prefers-reduced-motion`.
 */
export const Reveal: FC<RevealProps> = ({
    children,
    delay = 0,
    className
}): ReactNode => {
    const { ref, inView } = useInView<HTMLDivElement>()

    return (
        <div
            ref={ref}
            data-visible={inView}
            style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
            className={cn('reveal', className)}
        >
            {children}
        </div>
    )
}