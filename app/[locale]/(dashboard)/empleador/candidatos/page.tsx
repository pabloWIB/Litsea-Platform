import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Calendar, MessageCircle, Users } from 'lucide-react'
import type { ApplicationStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Candidatos — Litsea Empleos',
  robots: { index: false },
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  new:          { label: 'Nueva aplicación',       className: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
  reviewing:    { label: 'En revisión por Litsea', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  chat_enabled: { label: 'Chat habilitado',        className: 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20' },
  hired:        { label: 'Contratado ✓',           className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected:     { label: 'No seleccionado',        className: 'bg-red-50 text-red-600 border-red-200' },
}

type AppRow = {
  id: string
  status: ApplicationStatus
  created_at: string
  vacancy_title: string
  vacancy_id: string
  therapist_name: string
  therapist_avatar: string | null
  therapist_slug: string | null
  specialties: string[]
  experience_years: number
  is_litsea_grad: boolean
  is_verified: boolean
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function EmpleadorCandidatosPage({
  searchParams,
}: {
  searchParams: Promise<{ vacante?: string }>
}) {
  const { vacante } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let applications: AppRow[] = []
  let vacancyFilter: { id: string; title: string }[] = []

  try {
    const { data: ep } = await supabase
      .from('employer_profiles').select('id').eq('user_id', user.id).single()

    if (ep) {
      const { data: vacs } = await supabase
        .from('vacancies').select('id, title').eq('employer_id', ep.id).eq('is_active', true)
      vacancyFilter = (vacs ?? []) as typeof vacancyFilter

      let query = supabase
        .from('applications')
        .select(`
          id, status, created_at,
          vacancy:vacancies!vacancy_id(id, title, employer_id),
          therapist:therapist_profiles!therapist_id(
            id, slug, specialties, experience_years, is_litsea_grad, is_verified,
            profiles!user_id(full_name, avatar_url)
          )
        `)
        .eq('vacancies.employer_id', ep.id)
        .order('created_at', { ascending: false })

      if (vacante) query = query.eq('vacancy_id', vacante)

      const { data: apps } = await query

      applications = (apps ?? []).map((a: any) => {
        const vacancy  = Array.isArray(a.vacancy)  ? a.vacancy[0]  : a.vacancy
        const therapist = Array.isArray(a.therapist) ? a.therapist[0] : a.therapist
        const profile   = Array.isArray(therapist?.profiles) ? therapist?.profiles[0] : therapist?.profiles
        return {
          id:               a.id,
          status:           a.status as ApplicationStatus,
          created_at:       a.created_at,
          vacancy_title:    vacancy?.title ?? 'Vacante',
          vacancy_id:       vacancy?.id ?? '',
          therapist_name:   profile?.full_name ?? 'Terapeuta',
          therapist_avatar: profile?.avatar_url ?? null,
          therapist_slug:   therapist?.slug ?? null,
          specialties:      therapist?.specialties ?? [],
          experience_years: therapist?.experience_years ?? 0,
          is_litsea_grad:   therapist?.is_litsea_grad ?? false,
          is_verified:      therapist?.is_verified ?? false,
        }
      }).filter((a: AppRow) => a.status !== 'rejected')
    }
  } catch {  }

  const activeVacante = vacancyFilter.find(v => v.id === vacante)

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Candidatos</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {activeVacante ? `Filtrando: ${activeVacante.title}` : 'Terapeutas que aplicaron a tus vacantes.'}
          </p>
        </div>
        {vacante && (
          <Link href="/empleador/candidatos"
            className="shrink-0 text-xs text-[#2FB7A3] font-medium hover:underline">
            Ver todos →
          </Link>
        )}
      </div>

      {vacancyFilter.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/empleador/candidatos"
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              !vacante ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}>
            Todas las vacantes
          </Link>
          {vacancyFilter.map(v => (
            <Link key={v.id} href={`/empleador/candidatos?vacante=${v.id}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                vacante === v.id ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}>
              {v.title}
            </Link>
          ))}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <Users className="size-6 text-neutral-400" />
          </div>
          <h3 className="text-base font-semibold text-neutral-800 mb-1">Aún no hay candidatos</h3>
          <p className="text-sm text-neutral-500 max-w-xs">
            Cuando los terapeutas apliquen a tus vacantes, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const cfg = STATUS_CONFIG[app.status]
            const profileHref = app.therapist_slug
              ? `/terapeutas/${app.therapist_slug}`
              : null

            return (
              <div key={app.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">

                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="size-12 rounded-full bg-[#2FB7A3]/10 border border-neutral-200 flex items-center justify-center text-[#2FB7A3] font-bold text-sm shrink-0">
                    {app.therapist_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[15px] font-bold text-neutral-900 truncate">{app.therapist_name}</p>
                      {app.is_litsea_grad && (
                        <span className="text-[10px] font-bold text-[#2FB7A3] uppercase tracking-wide shrink-0">
                          Egresado Litsea
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {app.specialties.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                      <span>{app.vacancy_title}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(app.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.className}`}>
                    {cfg.label}
                  </span>

                  <div className="flex items-center gap-2">
                    {profileHref && (
                      <Link href={profileHref} target="_blank"
                        className="text-xs font-medium text-[#2FB7A3] hover:underline">
                        Ver perfil →
                      </Link>
                    )}
                    {app.status === 'chat_enabled' && (
                      <Link href="/empleador/mensajes"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2FB7A3] hover:underline">
                        <MessageCircle className="size-3.5" />
                        Chat
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
