import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon/favicon.ico',       sizes: 'any' },
      { url: '/favicon/favicon.svg',       type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/favicon/site.webmanifest',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') || 'es'

  return (
    <html lang={locale} className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
