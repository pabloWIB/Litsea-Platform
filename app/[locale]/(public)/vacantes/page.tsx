import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import VacanteCard, { type VacancyCardData } from '@/components/vacantes/VacanteCard'
import VacanteFiltros from '@/components/vacantes/VacanteFiltros'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Vacantes disponibles',
    description:
      'Explora oportunidades de trabajo para terapeutas certificados en hoteles y spas de lujo en Cancún, Playa del Carmen y Tulum.',
    alternates: { canonical: '/vacantes' },
  }
}

type SearchParams = Promise<{
  zona?: string
  especialidad?: string
  contrato?: string
}>

export default async function VacantesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { zona, especialidad, contrato } = await searchParams
  const t = await getTranslations('vacantesPage')

  let vacancies: VacancyCardData[] = []
  let totalActivas = 0

  try {
    const supabase = await createClient()

    const { count } = await supabase
      .from('vacancies')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    totalActivas = count ?? 0

    let query = supabase
      .from('vacancies')
      .select(
        'id, title, location, contract_type, specialties, is_featured, created_at, employer_profiles(company_name, logo_url, slug)',
      )
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (zona)         query = query.eq('location', zona)
    if (especialidad) query = query.contains('specialties', [especialidad])
    if (contrato)     query = query.eq('contract_type', contrato)

    const { data } = await query
    vacancies = (data ?? []) as VacancyCardData[]
  } catch {
  }

  const hasFilters = Boolean(zona || especialidad || contrato)

  const cardLabels = {
    labelDestacada:   t('destacada'),
    labelVerVacante:  t('verVacante'),
    labelHoy:         t('hoy'),
    labelAyer:        t('ayer'),
    labelHaceNDias:   (d: number) => t('haceNDias', { days: d }),
    labelHaceNMeses:  (m: number) => t('haceNMeses', { months: m }),
  }

  return (
    <>
      <section className="bg-[#071210] px-4 py-14 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
            {t('badge')}
          </p>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-[0.95] mb-4">
            {t('title1')}<br />
            <span className="text-[#2FB7A3]">{t('title2')}</span>
          </h1>

          <p className="text-sm text-white/50 max-w-md mb-6">
            {t('subtitle')}
          </p>

          <div className="inline-flex items-center gap-2 bg-white/6 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60">
            <Briefcase className="size-4 text-[#2FB7A3] shrink-0" />
            <span>
              <strong className="text-white font-semibold">{totalActivas}</strong>{' '}
              vacantes activas
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <Suspense fallback={<FilterSkeleton />}>
              <VacanteFiltros />
            </Suspense>

            {hasFilters && totalActivas > 0 && (
              <p className="text-sm text-neutral-500 shrink-0">
                <strong className="text-neutral-800 font-semibold">{vacancies.length}</strong>
                {' '}de {totalActivas} vacantes
              </p>
            )}
          </div>

          {vacancies.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              titleNoFilters={t('sinVacantesTitle')}
              descNoFilters={t('sinVacantesDesc')}
              titleFilters={t('sinResultadosTitle')}
              descFilters={t('sinResultadosDesc')}
              labelLimpiar={t('limpiarFiltros')}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vacancies.map((v) => (
                <VacanteCard key={v.id} vacante={v} {...cardLabels} />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  )
}

type VacancyRow = {
  id: string
  title: string
  location: string
  contract_type: string
  specialties: string[]
  is_featured: boolean
  created_at: string
  employer_profiles: { company_name: string; logo_url: string | null; slug: string | null } | null
}

function FilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {[120, 140, 160].map((w) => (
        <div
          key={w}
          className="h-10 rounded-full bg-neutral-200 animate-pulse"
          style={{ width: w }}
        />
      ))}
    </div>
  )
}

function EmptyState({
  hasFilters,
  titleNoFilters,
  descNoFilters,
  titleFilters,
  descFilters,
  labelLimpiar,
}: {
  hasFilters: boolean
  titleNoFilters: string
  descNoFilters: string
  titleFilters: string
  descFilters: string
  labelLimpiar: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Briefcase className="size-6 text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">
        {hasFilters ? titleFilters : titleNoFilters}
      </h3>
      <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
        {hasFilters ? descFilters : descNoFilters}
      </p>
      {hasFilters && (
        <a
          href="/vacantes"
          className="mt-5 inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          {labelLimpiar}
        </a>
      )}
    </div>
  )
}
