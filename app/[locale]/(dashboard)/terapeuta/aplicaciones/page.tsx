import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, MapPin, Calendar, MessageCircle } from 'lucide-react'
import type { ApplicationStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Mis aplicaciones — Litsea Empleos',
  robots: { index: false },
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  new:          { label: 'Nueva',            className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
  reviewing:    { label: 'En revisión',      className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  chat_enabled: { label: 'Chat habilitado',  className: 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20' },
  hired:        { label: 'Contratado ✓',    className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:     { label: 'No seleccionado',  className: 'bg-red-50 text-red-600 border-red-200' },
}

type AppRow = {
  id: string
  status: ApplicationStatus
  created_at: string
  vacancies: {
    id: string
    title: string
    location: string
    contract_type: string
    employer_profiles: { company_name: string; slug: string | null }[] | null
  }[] | null
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(dateStr))
}

export default async function TerapeutaAplicacionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let applications: AppRow[] = []

  try {
    const { data: tp } = await supabase
      .from('therapist_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (tp) {
      const { data } = await supabase
        .from('applications')
        .select(`
          id, status, created_at,
          vacancies (
            id, title, location, contract_type,
            employer_profiles ( company_name, slug )
          )
        `)
        .eq('therapist_id', tp.id)
        .order('created_at', { ascending: false })

      applications = (data ?? []) as AppRow[]
    }
  } catch {
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-black text-neutral-900">Mis aplicaciones</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Revisa el estado de tus postulaciones a vacantes.
        </p>
      </div>

      {applications.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {(['new', 'reviewing', 'chat_enabled', 'hired', 'rejected'] as ApplicationStatus[]).map(s => {
            const count = applications.filter(a => a.status === s).length
            if (count === 0) return null
            const cfg = STATUS_CONFIG[s]
            return (
              <span key={s}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
                {cfg.label}
                <span className="bg-black/10 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                  {count}
                </span>
              </span>
            )
          })}
        </div>
      )}

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const vacancy = Array.isArray(app.vacancies) ? app.vacancies[0] : app.vacancies
            const employer = Array.isArray(vacancy?.employer_profiles)
              ? vacancy?.employer_profiles[0]
              : vacancy?.employer_profiles
            const cfg = STATUS_CONFIG[app.status]

            return (
              <div key={app.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:border-neutral-300 transition-colors">

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#2FB7A3] uppercase tracking-wide mb-1 truncate">
                    {employer?.company_name ?? 'Empresa'}
                  </p>
                  <h2 className="text-[15px] font-bold text-neutral-900 mb-2 truncate">
                    {vacancy?.title ?? 'Vacante'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                    {vacancy?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-neutral-400" />
                        {vacancy.location}
                      </span>
                    )}
                    {vacancy?.contract_type && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="size-3.5 text-neutral-400" />
                        {vacancy.contract_type}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-neutral-400" />
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
                    {cfg.label}
                  </span>

                  {app.status === 'chat_enabled' && (
                    <Link
                      href="/terapeuta/mensajes"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2FB7A3] hover:underline"
                    >
                      <MessageCircle className="size-3.5" />
                      Ir al chat
                    </Link>
                  )}

                  {vacancy?.id && (
                    <Link
                      href={`/vacantes/${vacancy.id}`}
                      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      Ver vacante →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Briefcase className="size-6 text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-800 mb-1">
        Aún no has aplicado a ninguna vacante
      </h3>
      <p className="text-sm text-neutral-500 max-w-xs leading-relaxed mb-5">
        Explora las vacantes disponibles y aplica con un clic a las que sean de tu interés.
      </p>
      <Link
        href="/terapeuta/vacantes"
        className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3]"
      >
        Ver vacantes disponibles
      </Link>
    </div>
  )
}
