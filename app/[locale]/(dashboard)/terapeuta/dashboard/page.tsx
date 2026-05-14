import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Briefcase,
  CheckCircle2,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import type { ApplicationStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Dashboard — Litsea Empleos',
  robots: { index: false },
}

export default async function TerapeutaDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let fullName   = ''
  let avatarUrl: string | null = null
  let specialties: string[] = []
  let zones:       string[] = []
  let tpId:        string | null = null
  let isVerified   = false
  let certsCount   = 0
  let vacantesCount = 0
  let unreadCount  = 0
  let recentApps:  RecentApp[] = []

  try {
    const [profileRes, vacRes] = await Promise.all([
      supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
      supabase.from('vacancies').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])

    fullName  = profileRes.data?.full_name ?? ''
    avatarUrl = profileRes.data?.avatar_url ?? null
    vacantesCount = vacRes.count ?? 0

    const { data: tp } = await supabase
      .from('therapist_profiles')
      .select('id, specialties, zones, is_verified')
      .eq('user_id', user.id)
      .single()

    if (tp) {
      tpId       = tp.id
      specialties = tp.specialties ?? []
      zones       = tp.zones ?? []
      isVerified  = tp.is_verified ?? false

      const [certsRes, appsRes] = await Promise.all([
        supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true })
          .eq('therapist_id', tp.id),
        supabase
          .from('applications')
          .select('id, status, created_at, vacancies(title, employer_profiles(company_name))')
          .eq('therapist_id', tp.id)
          .order('created_at', { ascending: false })
          .limit(3),
      ])

      certsCount = certsRes.count ?? 0
      recentApps = (appsRes.data ?? []) as RecentApp[]
    }

    const { data: convs } = await supabase
      .from('conversations')
      .select('id')
      .eq('therapist_id', user.id)
      .eq('is_active', true)

    if (convs && convs.length > 0) {
      const convIds = convs.map(c => c.id)
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', convIds)
        .is('read_at', null)
        .neq('sender_id', user.id)
      unreadCount = count ?? 0
    }
  } catch {
  }

  const checkItems = [
    { label: 'Especialidad seleccionada', done: specialties.length > 0, href: '/terapeuta/perfil' },
    { label: 'Zonas de trabajo',          done: zones.length > 0,       href: '/terapeuta/perfil' },
    { label: 'Foto profesional',          done: Boolean(avatarUrl),     href: '/terapeuta/perfil' },
    { label: 'Certificados subidos',      done: certsCount > 0,         href: '/terapeuta/certificados' },
  ]
  const completedCount = checkItems.filter(i => i.done).length
  const percentage     = Math.round((completedCount / checkItems.length) * 100)
  const isComplete     = percentage === 100

  const firstName = fullName.split(' ')[0] || 'terapeuta'

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black text-neutral-900">
          ¡Bienvenido/a, {firstName}!
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {isComplete
            ? 'Tu perfil está completo. Los empleadores pueden encontrarte.'
            : 'Completa tu perfil para que los empleadores puedan encontrarte.'}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Briefcase className="size-5" />}
          label="Vacantes disponibles"
          value={vacantesCount}
          href="/terapeuta/vacantes"
          cta="Ver vacantes →"
        />
        <MetricCard
          icon={<CheckCircle2 className="size-5" />}
          label="Perfil completado"
          value={`${percentage}%`}
          href="/terapeuta/perfil"
          cta="Editar perfil →"
          highlight={isComplete}
        />
        <MetricCard
          icon={<MessageCircle className="size-5" />}
          label="Mensajes nuevos"
          value={unreadCount}
          href="/terapeuta/mensajes"
          cta="Ver mensajes →"
          badge={unreadCount > 0}
        />
      </div>

      {!isComplete && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              Tu perfil no es visible para empleadores
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Completa los pasos de abajo para aparecer en el directorio de terapeutas.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">

        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[15px] font-bold text-neutral-900">Progreso del perfil</h2>
            <span className={`text-sm font-bold tabular-nums ${
              isComplete ? 'text-[#2FB7A3]' : 'text-neutral-500'
            }`}>
              {percentage}%
            </span>
          </div>

          <div className="h-1.5 bg-neutral-100 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-[#2FB7A3] rounded-full transition-[width] duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <ul className="space-y-3.5">
            {checkItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  item.done
                    ? 'border-[#2FB7A3] bg-[#2FB7A3]'
                    : 'border-neutral-200'
                }`}>
                  {item.done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${item.done ? 'text-neutral-700' : 'text-neutral-400'}`}>
                  {item.label}
                </span>
                {!item.done && (
                  <Link href={item.href}
                    className="ml-auto text-xs text-[#2FB7A3] font-medium hover:underline shrink-0">
                    Completar
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {!isComplete && (
            <Link
              href="/terapeuta/perfil"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3]"
            >
              Completar mi perfil
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-neutral-900">Aplicaciones recientes</h2>
            <Link href="/terapeuta/aplicaciones"
              className="text-xs text-[#2FB7A3] font-medium hover:underline">
              Ver todas →
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Briefcase className="size-8 text-neutral-200 mb-2" />
              <p className="text-sm text-neutral-400">Aún no has aplicado a ninguna vacante.</p>
              <Link href="/terapeuta/vacantes"
                className="mt-3 text-xs text-[#2FB7A3] font-medium hover:underline">
                Ver vacantes disponibles →
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentApps.map((app) => {
                const vacancy = Array.isArray(app.vacancies) ? app.vacancies[0] : app.vacancies
                const employer = Array.isArray(vacancy?.employer_profiles)
                  ? vacancy?.employer_profiles[0]
                  : vacancy?.employer_profiles
                const cfg = STATUS_CONFIG[app.status]
                return (
                  <li key={app.id}
                    className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">
                        {vacancy?.title ?? 'Vacante'}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {employer?.company_name ?? ''}
                      </p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}

type RecentApp = {
  id: string
  status: ApplicationStatus
  created_at: string
  vacancies: {
    title: string
    employer_profiles: { company_name: string }[] | null
  }[] | null
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  new:          { label: 'Nueva',           className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
  reviewing:    { label: 'En revisión',     className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  chat_enabled: { label: 'Chat activo',     className: 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20' },
  hired:        { label: 'Contratado ✓',   className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:     { label: 'No seleccionado', className: 'bg-red-50 text-red-600 border-red-200' },
}

function MetricCard({
  icon,
  label,
  value,
  href,
  cta,
  highlight = false,
  badge = false,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  href: string
  cta: string
  highlight?: boolean
  badge?: boolean
}) {
  return (
    <div className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${
      highlight ? 'border-[#2FB7A3]/30' : 'border-neutral-200'
    }`}>
      <div className={`size-10 rounded-xl flex items-center justify-center ${
        highlight
          ? 'bg-[#2FB7A3]/10 text-[#2FB7A3]'
          : badge
          ? 'bg-[#2FB7A3]/8 text-[#2FB7A3]'
          : 'bg-neutral-100 text-neutral-500'
      }`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-black tabular-nums ${
          badge && (value as number) > 0 ? 'text-[#2FB7A3]' : 'text-neutral-900'
        }`}>
          {value}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
      </div>
      <Link
        href={href}
        className="text-xs font-semibold text-[#2FB7A3] hover:underline mt-auto"
      >
        {cta}
      </Link>
    </div>
  )
}
