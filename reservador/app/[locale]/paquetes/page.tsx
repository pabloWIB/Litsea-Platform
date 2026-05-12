import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { createClient } from '@supabase/supabase-js'
import { getTranslations } from 'next-intl/server'
import { MessageCircle, Check, Coffee, Waves, Flame, TreePine, Car, Dog, Bed, Moon, Sun } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const BASE = 'https://glampingreservadelruiz.website'
const PATH = '/paquetes'

const META = {
  es: {
    title: 'Paquetes y Precios',
    description: 'Elige tu plan de glamping en Villamaría, Caldas. Plan pareja desde $350.000/noche, plan familiar y pasadía. Jacuzzi privado, fogata y desayuno incluidos.',
    ogLocale: 'es_CO',
  },
  en: {
    title: 'Packages & Prices',
    description: 'Choose your glamping plan near Manizales, Colombia. Couple plan from $350,000 COP/night, family and day-pass options. Private jacuzzi, bonfire and breakfast included.',
    ogLocale: 'en_US',
  },
  fr: {
    title: 'Forfaits et Tarifs',
    description: 'Choisissez votre forfait glamping près de Manizales, Colombie. Forfait couple à partir de 350 000 COP/nuit, options famille et demi-journée. Jacuzzi privé, feu de camp et petit-déjeuner inclus.',
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
        es: `${BASE}${PATH}`,
        en: `${BASE}/en${PATH}`,
        fr: `${BASE}/fr${PATH}`,
      },
    },
    openGraph: {
      title: `${m.title} — Glamping Reserva del Ruiz`,
      description: m.description,
      url,
      siteName: 'Glamping Reserva del Ruiz',
      images: [{ url: '/bienvenida-glamping.webp', width: 1200, height: 630, alt: 'Glamping Reserva del Ruiz' }],
      locale: m.ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${m.title} — Glamping Reserva del Ruiz`,
      description: m.description,
      images: ['/bienvenida-glamping.webp'],
    },
  }
}

const INCLUDE_ICONS = [Coffee, Waves, Flame, TreePine, Car, Dog, Bed]
const INCLUDE_KEYS  = ['breakfast', 'jacuzzi', 'bonfire', 'hiking', 'parking', 'pets', 'bathroom'] as const
const EXTRA_KEYS    = ['restaurant', 'decoration', 'horse', 'person'] as const

function fmtCOP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
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
    return data ?? []
  } catch {
    return []
  }
}

export default async function PaquetesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [plans, t, tHome, tNav] = await Promise.all([
    getPlans(),
    getTranslations('packages'),
    getTranslations('home'),
    getTranslations('nav'),
  ])

  const waUrl = `https://wa.me/573152779642?text=${encodeURIComponent(t('waMessage'))}`

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative text-white px-4 pt-20 pb-24 text-center overflow-hidden">
        <Image
          src="/ilustracion-domo-naturaleza.webp"
          alt="Paquetes y precios — Glamping Reserva del Ruiz"
          fill
          className="object-cover object-right"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10">
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">{tNav('packages')}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {t('title')}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* ── Planes ───────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 -mt-8 pb-16">
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.id}
                className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex flex-col flex-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full w-fit mb-3">
                    {plan.is_flat
                      ? <><Sun size={10} /> {tHome('plansBadgeDay')}</>
                      : <><Moon size={10} /> {tHome('plansBadgeNight')}</>}
                  </span>
                  <h2 className="text-base font-bold text-neutral-900 mb-1">{plan.name}</h2>
                  <div className="mb-4">
                    <span className="text-2xl font-extrabold text-orange-500">{fmtCOP(plan.price)}</span>
                    <span className="text-neutral-400 text-xs ml-1">
                      {plan.is_flat ? `· ${t('flatRate')}` : `· ${t('perNight')}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mb-4">
                    {plan.is_flat ? tHome('plansTimingDay') : tHome('plansTimingNight')}
                  </p>
                  <div className="mt-auto">
                    <Link href="/disponibilidad">
                      <HoverBorderGradient
                        as="div"
                        containerClassName="border-orange-400 cursor-pointer w-full"
                        className="bg-orange-500 text-white text-sm font-semibold py-2.5 flex items-center justify-center w-full"
                      >
                        {t('ctaButton')}
                      </HoverBorderGradient>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">{t('loading')}</p>
          </div>
        )}
      </section>

      {/* ── Qué incluye ──────────────────────────────────────────── */}
      <section className="bg-white border-y border-neutral-100 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-2">{tHome('includesTitle')}</p>
          <h2 className="text-center text-xl font-bold text-neutral-900 mb-8">
            {tHome('includesSubtitle')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {INCLUDE_KEYS.map((key, i) => {
              const Icon = INCLUDE_ICONS[i]
              return (
                <div key={key} className="relative rounded-xl border border-neutral-100 bg-stone-50 p-2">
                  <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.01} />
                  <div className="relative flex items-center gap-2.5 rounded-lg px-2 py-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-orange-500" />
                    </div>
                    <span className="text-xs font-medium text-neutral-700 leading-tight">
                      {tHome(`includes.${key}` as any)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Extras ───────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">{t('optionals')}</p>
        <h2 className="text-center text-xl font-bold text-neutral-900 mb-6">{t('extras')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXTRA_KEYS.map((key) => (
            <div key={key} className="relative rounded-xl border border-neutral-100 bg-white p-2">
              <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.01} />
              <div className="relative flex items-center gap-3 rounded-lg px-3 py-2.5">
                <Check size={14} className="text-orange-400 shrink-0" />
                <span className="text-sm text-neutral-700">{t(`extraItems.${key}` as any)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────── */}
      <section className="bg-neutral-900 py-14 px-4 text-center">
        <h2 className="text-white text-2xl font-bold mb-3">{t('ctaTitle')}</h2>
        <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">
          {t('ctaDesc')}
        </p>
        <div className="flex justify-center">
        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <HoverBorderGradient
            as="div"
            containerClassName="border-green-400 cursor-pointer"
            className="bg-green-500 text-white text-sm font-semibold px-7 py-3 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            {tNav('bookWhatsApp')}
          </HoverBorderGradient>
        </a>
        </div>
        <p className="text-neutral-500 text-xs mt-4">
          {t('note')}
        </p>
      </section>

    </div>
  )
}
