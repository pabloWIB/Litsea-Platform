import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Toaster } from 'sonner'
import { getLocale } from 'next-intl/server'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://glampingreservadelruiz.website'),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body>
        {children}
        <Analytics />
        <Toaster position="top-center" richColors />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G9VG1BL520"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G9VG1BL520');
          `}
        </Script>
      </body>
    </html>
  )
}
