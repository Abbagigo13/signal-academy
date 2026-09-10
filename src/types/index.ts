import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type SiteConfig = {
    name: string
    description: string
    placeholder: string
    url: string
    ogImage?: string
    links?: {
        twitter?: string
        github?: string
    }
}

export type LayoutProps = {
    children: ReactNode
}

export type SeoProps = {
    title?: string
    description?: string
    ogImage?: string
}

/* ---------------------------------------------------------------------------
   Landing page content
   --------------------------------------------------------------------------- */

export type NavLink = {
    label: string
    href: string
}

export type SignalAccent = 'signal' | 'bright' | 'indigo' | 'amber'

export type SignalFrame = {
    readout: string
    strength: number
}

export type MarketSignal = {
    id: string
    label: string
    accent: SignalAccent
    frames: SignalFrame[]
}

export type Feature = {
    id: string
    icon: LucideIcon
    title: string
    description: string
    tag: string
}

export type Step = {
    id: string
    icon: LucideIcon
    title: string
    description: string
}

export type Stat = {
    id: string
    value: number
    prefix?: string
    label: string
}

export type TechPill = {
    id: string
    label: string
}

export type SocialLink = {
    id: string
    label: string
    href: string
    icon: LucideIcon
}