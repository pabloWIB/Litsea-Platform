import { Link } from '@/i18n/navigation'
import { MapPin, Clock, Star } from 'lucide-react'
import type { VacancyRow, EmployerProfileRow } from '@/types/database'

export type VacancyCardData = Pick<
  VacancyRow,
  'id' | 'title' | 'location' | 'contract_type' | 'specialties' | 'is_featured' | 'created_at'
> & {
  employer_profiles: Pick<EmployerProfileRow, 'company_name' | 'logo_url' | 'slug'>[] | null
}

function daysAgo(dateStr: string): { days: number; months: number } {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  return { days: diff, months: Math.floor(diff / 30) }
}

interface Props {
  vacante: VacancyCardData
  labelDestacada?: string
  labelVerVacante?: string
  labelHoy?: string
  labelAyer?: string
  labelHaceNDias?: (days: number) => string
  labelHaceNMeses?: (months: number) => string
}

export default function VacanteCard({
  vacante,
  labelDestacada = 'Destacada',
  labelVerVacante = 'Ver vacante →',
  labelHoy = 'Hoy',
  labelAyer = 'Ayer',
  labelHaceNDias = (d) => `Hace ${d} días`,
  labelHaceNMeses = (m) => `Hace ${m} ${m === 1 ? 'mes' : 'meses'}`,
}: Props) {
  const { days, months } = daysAgo(vacante.created_at)
  const company = (Array.isArray(vacante.employer_profiles) ? vacante.employer_profiles[0] : vacante.employer_profiles)?.company_name ?? ''

  const fechaLabel =
    days === 0 ? labelHoy
    : days === 1 ? labelAyer
    : days < 30 ? labelHaceNDias(days)
    : labelHaceNMeses(months)

  return (
    <article className="group relative bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-neutral-300">

      {vacante.is_featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#2FB7A3]/10 border border-[#2FB7A3]/20 text-[#2FB7A3] rounded-full px-2.5 py-0.5">
          <Star className="size-2.5 fill-current" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{labelDestacada}</span>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-[#2FB7A3] uppercase tracking-wide mb-1.5 pr-24 truncate">
          {company}
        </p>
        <h3 className="text-[15px] font-bold text-neutral-900 leading-snug group-hover:text-[#2FB7A3] transition-colors duration-150">
          {vacante.title}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0 text-neutral-400" />
          {vacante.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0 text-neutral-400" />
          {vacante.contract_type}
        </span>
      </div>

      {vacante.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {vacante.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200"
            >
              {s}
            </span>
          ))}
          {vacante.specialties.length > 3 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-400 border border-neutral-200">
              +{vacante.specialties.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-1 flex items-center justify-between gap-3">
        <span className="text-[11px] text-neutral-400 shrink-0">{fechaLabel}</span>
        <Link
          href={`/vacantes/${vacante.id}`}
          className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-4 py-1.5 text-xs font-semibold text-white ring-offset-2 transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] shrink-0"
        >
          {labelVerVacante}
        </Link>
      </div>
    </article>
  )
}
