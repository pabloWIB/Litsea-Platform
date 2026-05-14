import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { MapPin, CheckCircle2, Award } from 'lucide-react'

export type TerapeutaCardData = {
  id: string
  slug: string | null
  specialties: string[]
  zones: string[]
  experience_years: number
  is_litsea_grad: boolean
  profiles: { full_name: string; avatar_url: string | null }[] | null
}

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

interface Props {
  terapeuta: TerapeutaCardData
  labelEgresado?: string
  labelVerPerfil?: string
  labelExperiencia?: (years: number) => string
}

export default function TerapeutaCard({
  terapeuta,
  labelEgresado   = 'Egresado Litsea',
  labelVerPerfil  = 'Ver perfil →',
  labelExperiencia = (y) => `${y} año${y === 1 ? '' : 's'} de exp.`,
}: Props) {
  const profile = Array.isArray(terapeuta.profiles) ? terapeuta.profiles[0] : terapeuta.profiles
  const name = profile?.full_name ?? 'Terapeuta'
  const href = `/terapeutas/${terapeuta.slug ?? terapeuta.id}`

  return (
    <article className="group bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:border-neutral-300">

      <div className="flex items-center gap-3">
        <div className="relative size-12 rounded-full shrink-0 overflow-hidden border border-neutral-200">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className={`size-full flex items-center justify-center border ${avatarColor(name)}`}>
              <span className="text-sm font-bold">{initials(name)}</span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[15px] font-bold text-neutral-900 truncate group-hover:text-[#2FB7A3] transition-colors duration-150">
              {name}
            </p>
            <CheckCircle2 className="size-3.5 text-[#2FB7A3] shrink-0" />
          </div>

          {terapeuta.is_litsea_grad && (
            <div className="flex items-center gap-1 mt-0.5">
              <Award className="size-3 text-[#2FB7A3] shrink-0" />
              <span className="text-[11px] font-semibold text-[#2FB7A3]">{labelEgresado}</span>
            </div>
          )}
        </div>
      </div>

      {terapeuta.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {terapeuta.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200"
            >
              {s}
            </span>
          ))}
          {terapeuta.specialties.length > 3 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-400 border border-neutral-200">
              +{terapeuta.specialties.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
        {terapeuta.zones.length > 0 && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-neutral-400" />
            {terapeuta.zones.slice(0, 2).join(' · ')}
            {terapeuta.zones.length > 2 && ` +${terapeuta.zones.length - 2}`}
          </span>
        )}
        {terapeuta.experience_years > 0 && (
          <span className="text-neutral-400">
            {labelExperiencia(terapeuta.experience_years)}
          </span>
        )}
      </div>

      <div className="mt-auto pt-1">
        <Link
          href={href}
          className="inline-flex items-center justify-center w-full rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#2FB7A3] hover:text-white hover:border-[#2FB7A3] transition-all duration-200"
        >
          {labelVerPerfil}
        </Link>
      </div>
    </article>
  )
}
