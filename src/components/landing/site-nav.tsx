import type { FC, ReactNode } from 'react'

import { useEffect, useState } from 'react'
import { Menu, X, Activity } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ActionLink } from '@/components/landing/action-link'
import { navLinks } from '@/constants/landing'
import { siteConfig } from '@/constants/site'

export const SiteNav: FC = (): ReactNode => {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12)

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-all duration-300',
                scrolled || menuOpen
                    ? 'border-b border-border bg-background/85 backdrop-blur-xl'
                    : 'border-b border-transparent'
            )}
        >
            <nav
                aria-label='Main'
                className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8'
            >
                <a
                    href='#hero'
                    className='group flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4 focus-visible:ring-offset-background'
                >
                    <span className='flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-signal-bright to-brand shadow-[0_6px_18px_-8px_rgba(53,208,226,0.9)] transition-transform duration-300 group-hover:scale-105'>
                        <Activity className='size-5 text-white' strokeWidth={2.5} />
                    </span>

                    <span className='text-gradient-signal text-lg font-bold tracking-tight'>
                        {siteConfig.name}
                    </span>
                </a>

                <ul className='hidden items-center gap-9 md:flex'>
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className='group relative text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:text-white'
                            >
                                {link.label}

                                <span className='absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-signal-bright to-signal transition-all duration-300 group-hover:w-full' />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='flex items-center gap-2'>
                    <ActionLink href='#hero' className='hidden sm:inline-flex'>
                        Get Started
                    </ActionLink>

                    <button
                        type='button'
                        onClick={() => setMenuOpen(open => !open)}
                        aria-expanded={menuOpen}
                        aria-controls='mobile-menu'
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className='flex size-10 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-white transition-colors duration-200 hover:border-signal/60 hover:bg-signal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:hidden'
                    >
                        {menuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
                    </button>
                </div>
            </nav>

            <div
                id='mobile-menu'
                hidden={!menuOpen}
                className='border-t border-border bg-background/95 backdrop-blur-xl md:hidden'
            >
                <ul className='mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8'>
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className='block rounded-xl px-3 py-3 text-base font-medium text-muted-foreground transition-colors duration-200 hover:bg-white/5 hover:text-white'
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}

                    <li className='pt-2 sm:hidden'>
                        <ActionLink
                            href='#hero'
                            size='lg'
                            className='w-full'
                        >
                            Get Started
                        </ActionLink>
                    </li>
                </ul>
            </div>
        </header>
    )
}