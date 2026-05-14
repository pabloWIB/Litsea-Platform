import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import TerapeutaCard, { type TerapeutaCardData } from '@/components/terapeutas/TerapeutaCard'
import TerapeutaFiltros from '@/components/terapeutas/TerapeutaFiltros'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Directorio de terapeutas certificados',
    description:
      'Explora terapeutas egresados y verificados por Litsea Centro de Capacitación. Talento certificado para hoteles y spas de lujo en la Riviera Maya.',
    alternates: { canonical: '/terapeutas' },
  }
}

type SearchParams = Promise<{ especialidad?: string; zona?: string }>

export default async function TerapeutasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { especialidad, zona } = await searchParams
  const t = await getTranslations('terapeutasPage')

  let terapeutas: TerapeutaCardData[] = []
  let totalVerificados = 0

  try {
    const supabase = await createClient()

    const { count } = await supabase
      .from('therapist_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true)

    totalVerificados = count ?? 0

    let query = supabase
      .from('therapist_profiles')
      .select(
        'id, slug, specialties, zones, experience_years, is_litsea_grad, profiles(full_name, avatar_url)',
      )
      .eq('is_verified', true)
      .order('created_at', { ascending: false })

    if (especialidad) query = query.contains('specialties', [especialidad])
    if (zona)         query = query.contains('zones', [zona])

    const { data } = await query
    terapeutas = (data ?? []) as TerapeutaCardData[]
  } catch {
  }

  const hasFilters = Boolean(especialidad || zona)

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
            <Users className="size-4 text-[#2FB7A3] shrink-0" />
            <span>
              <strong className="text-white font-semibold">{totalVerificados}</strong>{' '}
              terapeutas verificados
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <Suspense fallback={<FilterSkeleton />}>
              <TerapeutaFiltros />
            </Suspense>

            {hasFilters && totalVerificados > 0 && (
              <p className="text-sm text-neutral-500 shrink-0">
                <strong className="text-neutral-800 font-semibold">{terapeutas.length}</strong>
                {' '}de {totalVerificados} terapeutas
              </p>
            )}
          </div>

          {terapeutas.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              titleFilters={t('sinResultadosTitle')}
              descFilters={t('sinResultadosDesc')}
              titleEmpty={t('sinTerapeutasTitle')}
              descEmpty={t('sinTerapeutasDesc')}
              labelClear={t('limpiarFiltros')}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {terapeutas.map((tp) => (
                <TerapeutaCard
                  key={tp.id}
                  terapeuta={tp}
                  labelEgresado={t('egresadoLitsea')}
                  labelVerPerfil={t('verPerfil')}
                  labelExperiencia={(y) => t('experiencia', { years: y })}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  )
}

function FilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {[140, 120].map((w) => (
        <div key={w} className="h-10 rounded-full bg-neutral-200 animate-pulse" style={{ width: w }} />
      ))}
    </div>
  )
}

function EmptyState({
  hasFilters,
  titleFilters,
  descFilters,
  titleEmpty,
  descEmpty,
  labelClear,
}: {
  hasFilters: boolean
  titleFilters: string
  descFilters: string
  titleEmpty: string
  descEmpty: string
  labelClear: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Users className="size-6 text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">
        {hasFilters ? titleFilters : titleEmpty}
      </h3>
      <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
        {hasFilters ? descFilters : descEmpty}
      </p>
      {hasFilters && (
        <a
          href="/terapeutas"
          className="mt-5 inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          {labelClear}
        </a>
      )}
    </div>
  )
}
