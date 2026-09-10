import type { FC, ReactNode } from 'react'

import { Heart, Activity } from 'lucide-react'

import { socialLinks } from '@/constants/landing'
import { siteConfig } from '@/constants/site'

export const SiteFooter: FC = (): ReactNode => {
    return (
        <footer className='relative border-t border-border px-5 py-12 sm:px-8'>
            <div
                aria-hidden='true'
                className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent'
            />

            <div className='mx-auto w-full max-w-7xl'>
                <div className='flex flex-col items-center justify-between gap-8 sm:flex-row'>
                    <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-3.5'>
                        <span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-signal-bright to-brand'>
                            <Activity className='size-5 text-white' strokeWidth={2.5} />
                        </span>

                        <p className='text-center text-sm text-muted-foreground sm:text-left'>
                            <span className='font-semibold text-white'>{siteConfig.name}</span>
                            <span aria-hidden='true' className='mx-2 text-white/25'>·</span>
                            Built for Bitget Hackathon S2
                        </p>
                    </div>

                    <ul className='flex items-center gap-3'>
                        {socialLinks.map(link => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    target='_blank'
                                    rel='noreferrer noopener'
                                    aria-label={link.label}
                                    className='flex size-11 items-center justify-center rounded-xl border border-border bg-white/[0.03] text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:border-signal/50 hover:bg-signal/10 hover:text-signal-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                                >
                                    <link.icon className='size-5' />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='mt-10 border-t border-border pt-7'>
                    <p className='flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground'>
                        Built with
                        <span className='sr-only'>love</span>
                        <Heart
                            aria-hidden='true'
                            className='size-4 fill-signal text-signal'
                        />
                        for Bitget AI Base Camp
                    </p>
                </div>
            </div>
        </footer>
    )
}