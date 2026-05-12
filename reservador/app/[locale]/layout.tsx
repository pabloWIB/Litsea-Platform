import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import Footer from '@/components/layout/Footer'
import WhatsAppChat from '@/components/ui/WhatsAppChat'
import MainWrapper from '@/components/layout/MainWrapper'
import TopBar from '@/components/layout/TopBar'

type Locale = 'es' | 'en' | 'fr'

const BASE = 'https://glampingreservadelruiz.website'

const META: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  es: {
    title: 'Glamping Reserva del Ruiz — El glamping de un millón de estrellas',
    description: 'Glamping en Villamaría, Caldas. Domos con jacuzzi privado, fogata, desayuno y naturaleza pura a 30 minutos de Manizales. Reserva tu experiencia.',
    ogLocale: 'es_CO',
  },
  en: {
    title: 'Glamping Reserva del Ruiz — The glamping of a million stars',
    description: 'Glamping near Manizales, Colombia. Private dome with jacuzzi, bonfire, breakfast and pure nature. 30 minutes from Manizales. Book your experience.',
    ogLocale: 'en_US',
  },
  fr: {
    title: 'Glamping Reserva del Ruiz — Le glamping d\'un million d\'étoiles',
    description: 'Glamping près de Manizales, Colombie. Dôme privé avec jacuzzi, feu de camp, petit-déjeuner et nature pure. À 30 minutes de Manizales.',
    ogLocale: 'fr_FR',
  },
}

export function generateStaticParams() {
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

  return {
    title: {
      default: m.title,
      template: `%s — Glamping Reserva del Ruiz`,
    },
    description: m.description,
    metadataBase: new URL(BASE),
    robots: { index: true, follow: true },
    alternates: {
      canonical: l === 'es' ? BASE : `${BASE}/${l}`,
      languages: {
        es: BASE,
        en: `${BASE}/en`,
        fr: `${BASE}/fr`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: l === 'es' ? BASE : `${BASE}/${l}`,
      siteName: 'Glamping Reserva del Ruiz',
      images: [
        {
          url: '/bienvenida-glamping.webp',
          width: 1200,
          height: 630,
          alt: 'Glamping Reserva del Ruiz',
        },
      ],
      locale: m.ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: ['/bienvenida-glamping.webp'],
    },
  }
}

const LD_JSON = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Glamping Reserva del Ruiz',
  description: META.es.description,
  url: BASE,
  telephone: '+573152779642',
  email: 'glampingreservadelruiz@gmail.com',
  image: `${BASE}/bienvenida-glamping.webp`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vereda Montaño',
    addressLocality: 'Villamaría',
    addressRegion: 'Caldas',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 4.980492,
    longitude: -75.448527,
  },
  sameAs: [
    'https://www.instagram.com/glampingreservadelruiz/',
    'https://web.facebook.com/profile.php?id=61578345478511',
    'https://www.tiktok.com/@reservadelruiz',
  ],
  priceRange: '$$',
  checkinTime: '15:00',
  checkoutTime: '13:00',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Jacuzzi privado', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Desayuno incluido', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Mascotas permitidas', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Parqueadero', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Fogata', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Senderismo ecológico', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Baño privado', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Malla catamarán', value: true },
  ],
  hasMap: 'https://maps.app.goo.gl/SvwB9vp3KDTF2R4W9',
  touristType: ['Couples', 'Families', 'Nature lovers'],
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
    notFound()
  }

  const messages = await getMessages()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_JSON) }}
      />
      <NextIntlClientProvider messages={messages}>
        <TopBar>
          <MainWrapper>{children}</MainWrapper>
          <Footer />
          <WhatsAppChat />
        </TopBar>
      </NextIntlClientProvider>
    </>
  )
}
