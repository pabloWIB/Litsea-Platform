import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Hero from '@/components/sections/Hero'
import WhySection from '@/components/home/WhySection'
import IncludesSection from '@/components/home/IncludesSection'
import PlansSection from '@/components/home/PlansSection'
import HomeCarousel from '@/components/home/HomeCarousel'
import ReviewsSection from '@/components/home/ReviewsSection'
import CtaSection from '@/components/home/CtaSection'

const BASE = 'https://glampingreservadelruiz.website'

const META = {
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
    title: "Glamping Reserva del Ruiz — Le glamping d'un million d'étoiles",
    description: 'Glamping près de Manizales, Colombie. Dôme privé avec jacuzzi, feu de camp, petit-déjeuner et nature pure. À 30 minutes de Manizales.',
    ogLocale: 'fr_FR',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = (['es', 'en', 'fr'].includes(locale) ? locale : 'es') as keyof typeof META
  const m = META[l]
  const url = l === 'es' ? BASE : `${BASE}/${l}`

  return {
    title: m.title,
    description: m.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        es: BASE,
        en: `${BASE}/en`,
        fr: `${BASE}/fr`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url,
      siteName: 'Glamping Reserva del Ruiz',
      images: [{ url: '/bienvenida-glamping.webp', width: 1200, height: 630, alt: 'Glamping Reserva del Ruiz' }],
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

async function getPlans() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('plans')
      .select('id, name, price, is_flat')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

async function getReviews() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('reviews')
      .select('id, name, location, body, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [plans, reviews] = await Promise.all([getPlans(), getReviews()])

  return (
    <>
      <Hero locale={locale} />
      <WhySection />
      <IncludesSection />
      <HomeCarousel />
      <PlansSection plans={plans} />
      <ReviewsSection reviews={reviews} />
      <CtaSection locale={locale} />
    </>
  )
}
