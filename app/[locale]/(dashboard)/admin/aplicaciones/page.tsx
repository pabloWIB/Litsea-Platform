import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { sendChatEnabledEmails, sendApplicationStatusEmail } from '@/lib/email'
import { Calendar } from 'lucide-react'
import type { ApplicationStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Aplicaciones — Admin',
  robots: { index: false },
}

type AppRow = {
  id: string
  status: ApplicationStatus
  created_at: string
  therapist_id: string
  vacancy_id: string
  therapist_name: string
  therapist_email: string
  therapist_slug: string | null
  vacancy_title: string
  employer_id: string
  employer_name: string
  has_conversation: boolean
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'new',          label: 'Nueva' },
  { value: 'reviewing',    label: 'En revisión' },
  { value: 'chat_enabled', label: 'Chat habilitado' },
  { value: 'hired',        label: 'Contratado' },
  { value: 'rejected',     label: 'Rechazada' },
]

const STATUS_CHIP: Record<ApplicationStatus, string> = {
  new:          'bg-neutral-100 text-neutral-600 border-neutral-200',
  reviewing:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  chat_enabled: 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20',
  hired:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected:     'bg-red-50 text-red-600 border-red-200',
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function AdminAplicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: statusFilter } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let applications: AppRow[] = []

  try {
    let query = supabase
      .from('applications')
      .select(`
        id, status, created_at, therapist_id, vacancy_id,
        vacancy:vacancies!vacancy_id(id, title, employer_id,
          employer:employer_profiles!employer_id(id, company_name)
        ),
        therapist:therapist_profiles!therapist_id(slug,
          profiles!user_id(full_name, email)
        ),
        conversations(id)
      `)
      .order('created_at', { ascending: false })

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter as ApplicationStatus)
    }

    const { data: apps } = await query

    applications = (apps ?? []).map((a: any) => {
      const vacancy   = Array.isArray(a.vacancy)   ? a.vacancy[0]   : a.vacancy
      const employer  = Array.isArray(vacancy?.employer) ? vacancy?.employer[0] : vacancy?.employer
      const therapist = Array.isArray(a.therapist) ? a.therapist[0] : a.therapist
      const pr        = Array.isArray(therapist?.profiles) ? therapist?.profiles[0] : therapist?.profiles
      const convs     = Array.isArray(a.conversations) ? a.conversations : []
      return {
        id:               a.id,
        status:           a.status as ApplicationStatus,
        created_at:       a.created_at,
        therapist_id:     a.therapist_id,
        vacancy_id:       a.vacancy_id,
        therapist_name:   pr?.full_name ?? 'Terapeuta',
        therapist_email:  pr?.email ?? '',
        therapist_slug:   therapist?.slug ?? null,
        vacancy_title:    vacancy?.title ?? 'Vacante',
        employer_id:      employer?.id ?? '',
        employer_name:    employer?.company_name ?? 'Empresa',
        has_conversation: convs.length > 0,
      }
    })
  } catch {  }

  async function changeStatus(appId: string, therapistId: string, vacancyId: string, employerId: string, newStatus: ApplicationStatus) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('applications').update({ status: newStatus }).eq('id', appId)

    if (newStatus === 'chat_enabled') {
      const { data: existing } = await supabase
        .from('conversations').select('id').eq('application_id', appId).single()
      if (!existing) {
        await supabase.from('conversations').insert({
          application_id: appId,
          therapist_id:   therapistId,
          employer_id:    employerId,
          is_active:      true,
        })
      }

      try {
        const [tRes, epRes, vRes] = await Promise.all([
          supabase.from('profiles').select('full_name, email').eq('id', therapistId).single(),
          supabase.from('employer_profiles').select('company_name, profiles!user_id(email)').eq('id', employerId).single(),
          supabase.from('vacancies').select('title').eq('id', vacancyId).single(),
        ])
        const employerProfile = epRes.data?.profiles
        const employerEmail = (Array.isArray(employerProfile) ? employerProfile[0] : employerProfile)?.email ?? ''
        if (tRes.data?.email && employerEmail) {
          await sendChatEnabledEmails({
            therapistEmail: tRes.data.email,
            therapistName:  tRes.data.full_name || 'Terapeuta',
            employerEmail,
            employerName:   epRes.data?.company_name || 'Empresa',
            vacancyTitle:   vRes.data?.title || 'Vacante',
          })
        }
      } catch {  }
    }

    if (newStatus === 'hired' || newStatus === 'rejected') {
      try {
        const [tRes, epRes, vRes] = await Promise.all([
          supabase.from('profiles').select('full_name, email').eq('id', therapistId).single(),
          supabase.from('employer_profiles').select('company_name').eq('id', employerId).single(),
          supabase.from('vacancies').select('title').eq('id', vacancyId).single(),
        ])
        if (tRes.data?.email) {
          await sendApplicationStatusEmail({
            therapistEmail: tRes.data.email,
            therapistName:  tRes.data.full_name || 'Terapeuta',
            employerName:   epRes.data?.company_name || 'Empresa',
            vacancyTitle:   vRes.data?.title || 'Vacante',
            status:         newStatus,
          })
        }
      } catch {  }
    }

    await logAudit(user.id, 'update_status', 'applications', appId, { new_status: newStatus })
    revalidatePath('/admin/aplicaciones')
  }

  const activeStatus = statusFilter && statusFilter !== 'all' ? statusFilter : null

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Aplicaciones</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {applications.length} aplicacion{applications.length !== 1 ? 'es' : ''}{activeStatus ? ` · filtro: ${STATUS_OPTIONS.find(s => s.value === activeStatus)?.label}` : ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link href="/admin/aplicaciones"
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            !activeStatus ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
          }`}>
          Todas
        </Link>
        {STATUS_OPTIONS.map(s => (
          <Link key={s.value} href={`/admin/aplicaciones?status=${s.value}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeStatus === s.value ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}>
            {s.label}
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-neutral-500">No hay aplicaciones{activeStatus ? ' con este estado' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(app => {
            const chip = STATUS_CHIP[app.status]
            return (
              <div key={app.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[15px] font-bold text-neutral-900">{app.therapist_name}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${chip}`}>
                      {STATUS_OPTIONS.find(s => s.value === app.status)?.label}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{app.vacancy_title} · <span className="text-neutral-400">{app.employer_name}</span></p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                    <Calendar className="size-3" />
                    {formatDate(app.created_at)}
                    {app.therapist_slug && (
                      <Link href={`/terapeutas/${app.therapist_slug}`} target="_blank"
                        className="ml-2 text-[#2FB7A3] hover:underline">
                        Ver perfil →
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.has_conversation && app.status === 'chat_enabled' && (
                    <Link href="/admin/mensajes"
                      className="text-xs font-medium text-[#2FB7A3] hover:underline">
                      Ver chat →
                    </Link>
                  )}
                  <form>
                    <select
                      defaultValue={app.status}
                      onChange={() => {}}
                      className="text-xs rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] appearance-none cursor-pointer"
                      name="status"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </form>
                  {STATUS_OPTIONS.filter(s => s.value !== app.status).map(s => (
                    <form key={s.value} action={changeStatus.bind(null, app.id, app.therapist_id, app.vacancy_id, app.employer_id, s.value)}>
                      <button type="submit"
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          s.value === 'chat_enabled'
                            ? 'border-[#2FB7A3]/40 text-[#2FB7A3] hover:bg-[#2FB7A3]/5'
                            : s.value === 'rejected'
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : s.value === 'hired'
                            ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        }`}>
                        → {s.label}
                      </button>
                    </form>
                  ))}
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
