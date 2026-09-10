// src/pages/_app.tsx
import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import { Inter, JetBrains_Mono } from 'next/font/google'

const sans = Inter({
    subsets: ['latin']
})

const mono = JetBrains_Mono({
    subsets: ['latin']
})

const fontVariables = `:root{--font-app-sans:${sans.style.fontFamily};--font-app-mono:${mono.style.fontFamily};--font-app-heading:${sans.style.fontFamily}}`

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <div className='h-full font-sans'>
            <Head>
                <style dangerouslySetInnerHTML={{ __html: fontVariables }} />
            </Head>

            <Component {...pageProps} />
        </div>
    )
}

export default App