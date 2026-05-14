import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import VacanteCard, { type VacancyCardData } from '@/components/vacantes/VacanteCard'
import VacanteFiltros from '@/components/vacantes/VacanteFiltros'
import { Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vacantes disponibles — Litsea Empleos',
  robots: { index: false },
}

type SearchParams = Promise<{
  zona?: string
  especialidad?: string
  contrato?: string
}>

export default async function TerapeutaVacantesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { zona, especialidad, contrato } = await searchParams

  let vacancies: VacancyCardData[] = []
  let appliedIds: Set<string> = new Set()

  try {
    const { data: tp } = await supabase
      .from('therapist_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

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

    const [vacRes, appsRes] = await Promise.all([
      query,
      tp
        ? supabase.from('applications').select('vacancy_id').eq('therapist_id', tp.id)
        : Promise.resolve({ data: [] }),
    ])

    vacancies  = (vacRes.data ?? []) as VacancyCardData[]
    appliedIds = new Set((appsRes.data ?? []).map((a: { vacancy_id: string }) => a.vacancy_id))
  } catch {  }

  const hasFilters = Boolean(zona || especialidad || contrato)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Vacantes disponibles</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Explora oportunidades en hoteles y spas de la Riviera Maya y aplica con un clic.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Suspense fallback={<FilterSkeleton />}>
          <VacanteFiltros />
        </Suspense>
        {vacancies.length > 0 && (
          <p className="text-sm text-neutral-500 shrink-0">
            <strong className="text-neutral-800">{vacancies.length}</strong> vacante{vacancies.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {vacancies.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vacancies.map(v => (
            <div key={v.id} className="relative">
              <VacanteCard
                vacante={v}
                labelVerVacante={appliedIds.has(v.id) ? 'Ya aplicaste →' : 'Ver vacante →'}
              />
              {appliedIds.has(v.id) && (
                <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                  Aplicada
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {[120, 140, 160].map(w => (
        <div key={w} className="h-10 rounded-full bg-neutral-200 animate-pulse" style={{ width: w }} />
      ))}
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Briefcase className="size-6 text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">
        {hasFilters ? 'Sin resultados' : 'Sin vacantes activas'}
      </h3>
      <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
        {hasFilters
          ? 'No hay vacantes que coincidan con tu búsqueda.'
          : 'No hay vacantes activas en este momento. Vuelve pronto.'}
      </p>
      {hasFilters && (
        <a href="/terapeuta/vacantes"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
          Limpiar filtros
        </a>
      )}
    </div>
  )
}
