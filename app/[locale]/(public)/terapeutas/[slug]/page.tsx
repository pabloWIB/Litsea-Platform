import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Award,
  Briefcase,
  GraduationCap,
} from 'lucide-react'

type TherapistProfile = {
  id: string
  slug: string | null
  specialties: string[]
  zones: string[]
  bio: string | null
  experience_years: number
  is_litsea_grad: boolean
  is_verified: boolean
  profiles: { full_name: string; avatar_url: string | null } | null
  certificates: { title: string; issued_by: string; issued_at: string | null }[]
}

const fetchTherapist = cache(async (slug: string): Promise<TherapistProfile | null> => {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('therapist_profiles')
      .select(`
        id, slug, specialties, zones, bio, experience_years, is_litsea_grad, is_verified,
        profiles(full_name, avatar_url),
        certificates(title, issued_by, issued_at)
      `)
      .eq('slug', slug)
      .eq('is_verified', true)
      .maybeSingle()
    return data as TherapistProfile | null
  } catch {
    return null
  }
})

const COLORS = [
  'bg-[#2FB7A3]/15 text-[#2FB7A3] border-[#2FB7A3]/25',
  'bg-violet-100 text-violet-600 border-violet-200',
  'bg-amber-100 text-amber-600 border-amber-200',
  'bg-rose-100 text-rose-600 border-rose-200',
  'bg-sky-100 text-sky-600 border-sky-200',
]

function avatarColor(name: string) {
  return COLORS[name.charCodeAt(0) % COLORS.length]
}

function initials(name: string) {
  const words = name.trim().split(/\s+/)
  return words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function formatIssuedAt(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tp = await fetchTherapist(slug)
  if (!tp) return { title: 'Terapeuta no encontrado' }

  const name = tp.profiles?.full_name ?? 'Terapeuta certificado'
  const specs = tp.specialties.slice(0, 3).join(', ')
  const zones = tp.zones.slice(0, 2).join(', ')
  const desc  = `Terapeuta certificado por Litsea. ${specs ? `Especialidades: ${specs}. ` : ''}${zones ? `Disponible en ${zones}.` : ''}`

  return {
    title: name,
    description: desc,
    alternates: { canonical: `/terapeutas/${slug}` },
    openGraph: {
      title: `${name} — Litsea Empleos`,
      description: desc,
      ...(tp.profiles?.avatar_url ? { images: [{ url: tp.profiles.avatar_url }] } : {}),
    },
  }
}

export default async function TerapeutaProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tp = await fetchTherapist(slug)
  if (!tp) notFound()

  const t    = await getTranslations('terapeutasPage')
  const name = tp.profiles?.full_name ?? 'Terapeuta'

  const verifiedCerts = (tp.certificates ?? []).filter((c) => c.title)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(tp.bio ? { description: tp.bio } : {}),
    ...(tp.profiles?.avatar_url ? { image: tp.profiles.avatar_url } : {}),
    knowsAbout: tp.specialties,
    ...(tp.is_litsea_grad
      ? {
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Certificación profesional',
            recognizedBy: {
              '@type': 'Organization',
              name: 'Litsea Centro de Capacitación',
              url: 'https://litseacc.edu.mx',
            },
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/terapeutas"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t('title1')} {t('title2').replace('.', '')}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">

        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">

          <div className="relative size-24 rounded-full shrink-0 overflow-hidden border-2 border-neutral-200 self-center sm:self-start">
            {tp.profiles?.avatar_url ? (
              <Image
                src={tp.profiles.avatar_url}
                alt={name}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            ) : (
              <div className={`size-full flex items-center justify-center ${avatarColor(name)}`}>
                <span className="text-2xl font-bold">{initials(name)}</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight mb-2">
              {name}
            </h1>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-[#2FB7A3]/10 border border-[#2FB7A3]/20 text-[#2FB7A3] text-xs font-semibold px-3 py-1 rounded-full">
                <CheckCircle2 className="size-3.5" />
                {t('verificado')}
              </span>
              {tp.is_litsea_grad && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                  <Award className="size-3.5" />
                  {t('egresadoLitsea')}
                </span>
              )}
            </div>

            {tp.zones.length > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                <MapPin className="size-3.5 shrink-0 text-neutral-400" />
                <span>{tp.zones.join(' · ')}</span>
              </div>
            )}

            {tp.experience_years > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-1">
                <Briefcase className="size-3.5 shrink-0 text-neutral-400" />
                <span>{t('anyosExp', { years: tp.experience_years })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">

          {tp.bio && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                {t('sobreMi')}
              </h2>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {tp.bio}
              </p>
            </section>
          )}

          {tp.specialties.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                {t('especialidades')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tp.specialties.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-neutral-200 text-neutral-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {tp.zones.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                {t('zonas')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {tp.zones.map((z) => (
                  <span
                    key={z}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-neutral-200 text-neutral-600 flex items-center gap-1.5"
                  >
                    <MapPin className="size-3.5 text-neutral-400" />
                    {z}
                  </span>
                ))}
              </div>
            </section>
          )}

          {verifiedCerts.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                {t('certificaciones')}
              </h2>
              <div className="space-y-2">
                {verifiedCerts.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3"
                  >
                    <GraduationCap className="size-4 text-[#2FB7A3] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{cert.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {cert.issued_by}
                        {cert.issued_at && ` · ${formatIssuedAt(cert.issued_at)}`}
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#2FB7A3]">
                      {t('litseaVerificado')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
            <h3 className="text-base font-bold text-neutral-900 mb-1">{t('ctaTitulo')}</h3>
            <p className="text-sm text-neutral-500 mb-4">{t('ctaDesc')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/registro-empleador"
                className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-[#2FB7A3]"
              >
                {t('ctaBoton')}
              </Link>
              <Link
                href="/vacantes"
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                {t('ctaVerVacantes')}
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
