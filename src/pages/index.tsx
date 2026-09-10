// src/pages/index.tsx
import type { FC, ReactNode } from 'react'

import { Fragment } from 'react'

import { Seo } from '@/components/generals/seo'
import { Layout } from '@/components/generals/layout'
import { ParticleField } from '@/components/landing/particle-field'
import { SiteNav } from '@/components/landing/site-nav'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { StatsSection } from '@/components/landing/stats-section'
import { TechStackSection } from '@/components/landing/tech-stack-section'
import { SiteFooter } from '@/components/landing/site-footer'

const Home: FC = (): ReactNode => {
    return (
        <Fragment>
            <Seo />

            <ParticleField />

            <SiteNav />

            <Layout>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
                <StatsSection />
                <TechStackSection />
            </Layout>

            <SiteFooter />
        </Fragment>
    )
}

export default Home