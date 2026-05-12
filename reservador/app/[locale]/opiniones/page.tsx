import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { Star } from 'lucide-react'
import ReviewForm from '@/components/opiniones/ReviewForm'
import { getTranslations } from 'next-intl/server'

const BASE = 'https://glampingreservadelruiz.website'
const PATH = '/opiniones'

const META = {
  es: {
    title: 'Opiniones',
    description: 'Lee las experiencias de quienes han visitado Glamping Reserva del Ruiz en Villamaría, Caldas. Deja tu propia reseña y comparte tu historia.',
    ogLocale: 'es_CO',
  },
  en: {
    title: 'Reviews',
    description: 'Read experiences from guests who have visited Glamping Reserva del Ruiz near Manizales, Colombia. Leave your own review and share your story.',
    ogLocale: 'en_US',
  },
  fr: {
    title: 'Avis',
    description: 'Lisez les expériences des visiteurs du Glamping Reserva del Ruiz près de Manizales, Colombie. Laissez votre propre avis et partagez votre histoire.',
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
  const url = l === 'es' ? `${BASE}${PATH}` : `${BASE}/${l}${PATH}`

  return {
    title: m.title,
    description: m.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        es:  `${BASE}${PATH}`,
        en:  `${BASE}/en${PATH}`,
        fr:  `${BASE}/fr${PATH}`,
      },
    },
    openGraph: {
      title:       `${m.title} — Glamping Reserva del Ruiz`,
      description: m.description,
      url,
      siteName: 'Glamping Reserva del Ruiz',
      images:   [{ url: '/bienvenida-glamping.webp', width: 1200, height: 630, alt: 'Glamping Reserva del Ruiz' }],
      locale:   m.ogLocale,
      type:     'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${m.title} — Glamping Reserva del Ruiz`,
      description: m.description,
      images:      ['/bienvenida-glamping.webp'],
    },
  }
}

async function getApprovedReviews() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('reviews')
      .select('id, name, location, body, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
}

export default async function OpinionesPage() {
  const [reviews, t, tHome] = await Promise.all([
    getApprovedReviews(),
    getTranslations('reviews'),
    getTranslations('home'),
  ])

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative text-white px-4 pt-20 pb-24 text-center overflow-hidden">
        <Image
          src="/ilustracion-opiniones.webp"
          alt="Opiniones — Glamping Reserva del Ruiz"
          fill
          className="object-cover object-right"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10">
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
            {tHome('reviewsKicker')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {t('title')}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
            {tHome('reviewsSubtitle')} {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16 space-y-10">

        {/* ── Reseñas aprobadas ─────────────────────────────── */}
        {reviews.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex text-orange-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed flex-1">"{r.body}"</p>
                  <div>
                    <p className="font-semibold text-neutral-900 text-sm">{r.name}</p>
                    {r.location && <p className="text-neutral-400 text-xs">{r.location}</p>}
                    <p className="text-neutral-300 text-xs mt-0.5">{fmtDate(r.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

{/* ── Formulario ────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto">
          <ReviewForm />
        </section>

      </div>
    </div>
  )
}
