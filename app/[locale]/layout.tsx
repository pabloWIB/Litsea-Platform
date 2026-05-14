import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'
import TopBar from '@/components/layout/TopBar'
import WhatsAppChat from '@/components/ui/WhatsAppChat'

const APP_URL = 'https://empleos.litseacc.edu.mx'

type Locale = 'es' | 'en' | 'fr'

const META: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  es: {
    title: 'Litsea Empleos — Bolsa de trabajo para terapeutas certificados',
    description:
      'Conectamos terapeutas egresados de Litsea Centro de Capacitación con hoteles y spas de lujo en la Riviera Maya. Talento verificado, oportunidades reales.',
    ogLocale: 'es_MX',
  },
  en: {
    title: 'Litsea Empleos — Job board for certified spa therapists',
    description:
      'We connect Litsea-certified therapists with luxury hotels and spas in the Riviera Maya. Verified talent, real opportunities.',
    ogLocale: 'en_US',
  },
  fr: {
    title: 'Litsea Empleos — Plateforme d\'emploi pour thérapeutes certifiés',
    description:
      'Nous connectons les thérapeutes certifiés Litsea avec les hôtels et spas de luxe en Riviera Maya. Talent vérifié, opportunités réelles.',
    ogLocale: 'fr_FR',
  },
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = (routing.locales.includes(locale as Locale) ? locale : 'es') as Locale
  const m = META[l]
  const url = l === 'es' ? APP_URL : `${APP_URL}/${l}`

  const isSpanish = l === 'es'

  return {
    metadataBase: new URL(APP_URL),
    title: { default: m.title, template: '%s | Litsea Empleos' },
    description: m.description,
    keywords: isSpanish ? [
      'bolsa de trabajo terapeutas',
      'empleo spa Riviera Maya',
      'terapeutas certificados Cancún',
      'Litsea Centro de Capacitación',
      'empleo wellness México',
      'vacantes terapeuta certificado',
    ] : undefined,
    robots: isSpanish
      ? { index: true, follow: true }
      : { index: false, follow: false },
    alternates: {
      canonical: APP_URL,
      languages: { es: APP_URL, en: `${APP_URL}/en`, fr: `${APP_URL}/fr` },
    },
    openGraph: {
      type: 'website',
      locale: m.ogLocale,
      url,
      siteName: 'Litsea Empleos',
      title: m.title,
      description: m.description,
      images: [
        {
          url: '/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png',
          width: 1280,
          height: 960,
          alt: 'Terapeuta certificada Litsea — Riviera Maya',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: ['/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png'],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    redirect('/')
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <TopBar>
        {children}
        <WhatsAppChat />
      </TopBar>
    </NextIntlClientProvider>
  )
}
