import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Star,
  Globe,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import AplicarButton from '@/components/vacantes/AplicarButton'
import type { ApplicationStatus } from '@/types/database'

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function toEmploymentType(contract: string): string {
  if (contract === 'Tiempo completo') return 'FULL_TIME'
  if (contract === 'Por temporada')   return 'TEMPORARY'
  if (contract === 'Freelance')       return 'CONTRACTOR'
  return 'OTHER'
}

function getRegion(location: string): string {
  return location === 'Mérida' ? 'Yucatán' : 'Quintana Roo'
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  new:          { label: 'Aplicación enviada',        className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
  reviewing:    { label: 'En revisión por Litsea',    className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  chat_enabled: { label: 'Chat habilitado ✓',         className: 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20' },
  hired:        { label: '¡Contratado/a! ✓',          className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:     { label: 'No seleccionado/a',         className: 'bg-red-50 text-red-600 border-red-200' },
}

type VacancyDetail = {
  id: string
  title: string
  description: string
  location: string
  position_type: string
  contract_type: string
  specialties: string[]
  is_featured: boolean
  created_at: string
  employer_profiles: {
    id: string
    company_name: string
    website: string | null
    logo_url: string | null
    slug: string | null
    description: string | null
  } | null
}

const fetchVacancy = cache(async (id: string): Promise<VacancyDetail | null> => {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('vacancies')
      .select(`
        id, title, description, location, position_type, contract_type,
        specialties, is_featured, created_at,
        employer_profiles (
          id, company_name, website, logo_url, slug, description
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()
    return data as VacancyDetail | null
  } catch {
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const vacancy = await fetchVacancy(id)
  if (!vacancy) return { title: 'Vacante no encontrada' }

  const company = vacancy.employer_profiles?.company_name ?? ''
  const title   = company ? `${vacancy.title} en ${company}` : vacancy.title
  const desc    = `${vacancy.position_type || 'Terapeuta'} · ${vacancy.location} · ${vacancy.contract_type}. ${company ? `Publicado por ${company}. ` : ''}Aplica en Litsea Empleos.`

  return {
    title,
    description: desc,
    alternates: { canonical: `/vacantes/${id}` },
    openGraph: { title, description: desc },
  }
}

export default async function VacanteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const vacancy = await fetchVacancy(id)
  if (!vacancy) notFound()

  const employer = vacancy.employer_profiles

  let role: string | null = null
  let therapistId: string | null = null
  let existingApp: { id: string; status: ApplicationStatus } | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [profileRes, tpRes] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        supabase.from('therapist_profiles').select('id').eq('user_id', user.id).single(),
      ])

      role        = profileRes.data?.role ?? null
      therapistId = tpRes.data?.id ?? null

      if (therapistId) {
        const { data: app } = await supabase
          .from('applications')
          .select('id, status')
          .eq('vacancy_id', vacancy.id)
          .eq('therapist_id', therapistId)
          .maybeSingle()

        if (app) existingApp = { id: app.id as string, status: app.status as ApplicationStatus }
      }
    }
  } catch {
  }

  async function aplicar() {
    'use server'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect(`/login/terapeuta?next=/vacantes/${vacancy!.id}`)

    const { data: tp } = await supabase
      .from('therapist_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!tp) return

    await supabase.from('applications').insert({
      vacancy_id:   vacancy!.id,
      therapist_id: tp.id,
      status:       'new',
    })

    revalidatePath(`/vacantes/${vacancy!.id}`)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: vacancy.title,
    description: vacancy.description,
    datePosted: vacancy.created_at.split('T')[0],
    employmentType: toEmploymentType(vacancy.contract_type),
    qualifications: 'Certificación Litsea Centro de Capacitación',
    hiringOrganization: employer
      ? {
          '@type': 'Organization',
          name: employer.company_name,
          ...(employer.website ? { sameAs: employer.website } : {}),
        }
      : undefined,
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: vacancy.location,
        addressRegion: getRegion(vacancy.location),
        addressCountry: 'MX',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/vacantes"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Vacantes disponibles
          </Link>
        </div>
      </div>

      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-200">
              <Building2 className="size-6 text-neutral-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2FB7A3] mb-1">
                {employer?.company_name ?? 'Empresa'}
              </p>

              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 leading-tight mb-4">
                {vacancy.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0 text-neutral-400" />
                  {vacancy.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0 text-neutral-400" />
                  {vacancy.contract_type}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 shrink-0 text-neutral-400" />
                  Publicada el {formatDate(vacancy.created_at)}
                </span>
                {vacancy.is_featured && (
                  <span className="inline-flex items-center gap-1 bg-[#2FB7A3]/10 border border-[#2FB7A3]/20 text-[#2FB7A3] rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    <Star className="size-2.5 fill-current" />
                    Destacada
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[1fr_320px] gap-8 md:gap-12 items-start">

          <div className="min-w-0 space-y-8">

            {vacancy.specialties.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                  Especialidades requeridas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {vacancy.specialties.map((s) => (
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

            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                Descripción del puesto
              </h2>
              <div className="prose prose-neutral prose-sm max-w-none text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {vacancy.description}
              </div>
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <CheckCircle2 className="size-5 text-[#2FB7A3] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Candidatos verificados por Litsea
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Solo terapeutas egresados y validados por el equipo Litsea Centro de Capacitación pueden aplicar a esta vacante.
                </p>
              </div>
            </div>

          </div>

          <aside className="md:sticky md:top-24 space-y-4">

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-2">
                ¿Te interesa esta vacante?
              </p>
              <h3 className="text-base font-bold text-neutral-900 mb-5 leading-snug">
                {vacancy.title}
              </h3>

              {!role && (
                <Link
                  href={`/login/terapeuta?next=/vacantes/${vacancy.id}`}
                  className="w-full flex items-center justify-center rounded-full bg-[#2FB7A3] px-6 py-3 text-sm font-semibold text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-[#2FB7A3]"
                >
                  Aplicar ahora
                </Link>
              )}

              {role === 'therapist' && !existingApp && (
                <AplicarButton action={aplicar} />
              )}

              {role === 'therapist' && existingApp && (
                <div className="space-y-3">
                  <div className={`w-full flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold ${STATUS_CONFIG[existingApp.status].className}`}>
                    {STATUS_CONFIG[existingApp.status].label}
                  </div>
                  {existingApp.status === 'chat_enabled' && (
                    <Link
                      href="/terapeuta/mensajes"
                      className="w-full flex items-center justify-center rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Ir al chat →
                    </Link>
                  )}
                </div>
              )}

              {(role === 'employer' || role === 'admin') && (
                <p className="text-xs text-neutral-400 text-center">
                  Solo los terapeutas pueden aplicar a vacantes.
                </p>
              )}

              {!role && (
                <p className="mt-3 text-center text-xs text-neutral-400">
                  ¿Aún no tienes cuenta?{' '}
                  <Link
                    href="/registro-terapeuta"
                    className="text-[#2FB7A3] font-medium hover:underline"
                  >
                    Regístrate gratis
                  </Link>
                </p>
              )}
            </div>

            {employer && (
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400 mb-3">
                  Empleador
                </p>
                <p className="text-sm font-semibold text-neutral-800 mb-1">
                  {employer.company_name}
                </p>
                {employer.description && (
                  <p className="text-xs text-neutral-500 leading-relaxed mb-3 line-clamp-3">
                    {employer.description}
                  </p>
                )}
                {employer.website && (
                  <a
                    href={employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#2FB7A3] font-medium hover:underline"
                  >
                    <Globe className="size-3.5" />
                    Sitio web
                  </a>
                )}
              </div>
            )}

          </aside>
        </div>
      </div>
    </>
  )
}
