import type { FC, ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ActionLinkProps {
    href: string
    children: ReactNode
    variant?: 'solid' | 'outline'
    size?: 'sm' | 'lg'
    className?: string
}

const base = 'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variants = {
    solid: 'bg-gradient-to-r from-signal-bright via-signal to-signal text-[#04121A] shadow-[0_10px_30px_-12px_rgba(29,162,180,0.9)] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-12px_rgba(53,208,226,0.75)]',
    outline: 'border border-signal/35 bg-white/[0.03] text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-signal/80 hover:bg-signal/10'
}

const sizes = {
    sm: 'px-5 py-2 text-sm',
    lg: 'px-7 py-3.5 text-base'
}

export const ActionLink: FC<ActionLinkProps> = ({
    href,
    children,
    variant = 'solid',
    size = 'sm',
    className
}): ReactNode => {
    return (
        <a
            href={href}
            className={cn(base, variants[variant], sizes[size], className)}
        >
            {children}
        </a>
    )
}