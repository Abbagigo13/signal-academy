import type { SiteConfig } from '@/types'
import { getOrigin } from '@/lib/window'

export const siteConfig: SiteConfig = {
    name: 'Signal Academy',
    description: 'AI-powered market signals and an interactive trading academy. Build skills, paper trade, and earn rewards in one platform.',
    placeholder: 'Your new site will appear right here. Just ask Modulify to generate anything you can describe.',
    url: getOrigin(),
    links: {
        github: 'https://github.com',
        twitter: 'https://x.com'
    }
}