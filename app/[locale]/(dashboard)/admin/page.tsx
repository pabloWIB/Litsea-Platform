import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  Users, Briefcase, FileCheck, MessageCircle, Star, ShieldCheck,
  ClipboardList, ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin — Litsea Empleos',
  robots: { index: false },
}

function MetricCard({
  label, value, sub, icon: Icon, href, accent = false,
}: {
  label: string; value: number; sub?: string
  icon: React.ElementType; href: string; accent?: boolean
}) {
  return (
    <Link href={href}
      className={`group flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:shadow-md ${
        accent
          ? 'border-[#2FB7A3]/30 bg-[#2FB7A3]/5 hover:border-[#2FB7A3]/50'
          : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}>
      <div className="flex items-center justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl ${
          accent ? 'bg-[#2FB7A3]/15 text-[#2FB7A3]' : 'bg-neutral-100 text-neutral-500'
        }`}>
          <Icon className="size-5" />
        </div>
        <ChevronRight className="size-4 text-neutral-300 transition-transform group-hover:translate-x-0.5" />
      </div>
      <div>
        <p className="text-2xl font-black text-neutral-900">{value}</p>
        <p className="text-sm font-semibold text-neutral-700">{label}</p>
        {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
      </div>
    </Link>
  )
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let metrics = { terapeutas: 0, empleadores: 0, vacantesActivas: 0, aplicacionesNuevas: 0, certificadosPendientes: 0, opinionesPendientes: 0, chatHabilitados: 0 }
  let recentApps: { id: string; therapist_name: string; vacancy_title: string; status: string; created_at: string }[] = []

  try {
    const [
      { count: t }, { count: e }, { count: v }, { count: an },
      { count: cp }, { count: op }, { count: ch }, { data: apps },
    ] = await Promise.all([
      supabase.from('therapist_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('employer_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('vacancies').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('certificates').select('id', { count: 'exact', head: true }).eq('verified', false),
      supabase.from('opiniones').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'chat_enabled'),
      supabase.from('applications').select(`
        id, status, created_at,
        vacancy:vacancies!vacancy_id(title),
        therapist:therapist_profiles!therapist_id(profiles!user_id(full_name))
      `).order('created_at', { ascending: false }).limit(5),
    ])

    metrics = { terapeutas: t ?? 0, empleadores: e ?? 0, vacantesActivas: v ?? 0, aplicacionesNuevas: an ?? 0, certificadosPendientes: cp ?? 0, opinionesPendientes: op ?? 0, chatHabilitados: ch ?? 0 }

    recentApps = (apps ?? []).map((a: any) => {
      const vacancy   = Array.isArray(a.vacancy)   ? a.vacancy[0]   : a.vacancy
      const therapist = Array.isArray(a.therapist)  ? a.therapist[0] : a.therapist
      const pr        = Array.isArray(therapist?.profiles) ? therapist?.profiles[0] : therapist?.profiles
      return { id: a.id, therapist_name: pr?.full_name ?? 'Terapeuta', vacancy_title: vacancy?.title ?? 'Vacante', status: a.status, created_at: a.created_at }
    })
  } catch {  }

  const STATUS_CHIP: Record<string, string> = {
    new:          'text-neutral-600 bg-neutral-100',
    reviewing:    'text-yellow-700 bg-yellow-50',
    chat_enabled: 'text-[#2FB7A3] bg-[#2FB7A3]/10',
    hired:        'text-emerald-700 bg-emerald-50',
    rejected:     'text-red-600 bg-red-50',
  }
  const STATUS_LABEL: Record<string, string> = { new: 'Nueva', reviewing: 'En revisión', chat_enabled: 'Chat habilitado', hired: 'Contratado', rejected: 'Rechazada' }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-neutral-900">Panel de administración</h1>
        <p className="text-sm text-neutral-500 mt-1">Vista general de la plataforma Litsea Empleos.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Terapeutas"       value={metrics.terapeutas}     icon={Users}         href="/admin/terapeutas" />
        <MetricCard label="Empleadores"      value={metrics.empleadores}    icon={Briefcase}     href="/admin/empleadores" />
        <MetricCard label="Vacantes activas" value={metrics.vacantesActivas} icon={ShieldCheck}  href="/admin/vacantes" />
        <MetricCard label="Chats activos"    value={metrics.chatHabilitados} icon={MessageCircle} href="/admin/mensajes" />
      </div>

      <h2 className="text-base font-bold text-neutral-800 mb-3">Acciones pendientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard label="Aplicaciones nuevas"     value={metrics.aplicacionesNuevas}    icon={ClipboardList} href="/admin/aplicaciones"  accent={metrics.aplicacionesNuevas > 0} />
        <MetricCard label="Certificados pendientes" value={metrics.certificadosPendientes} icon={FileCheck}     href="/admin/certificados" accent={metrics.certificadosPendientes > 0} />
        <MetricCard label="Opiniones pendientes"    value={metrics.opinionesPendientes}   icon={Star}          href="/admin/opiniones"    accent={metrics.opinionesPendientes > 0} />
      </div>

      <h2 className="text-base font-bold text-neutral-800 mb-3">Acceso rápido</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          ['/admin/aplicaciones', 'Aplicaciones'],
          ['/admin/terapeutas',   'Terapeutas'],
          ['/admin/empleadores',  'Empleadores'],
          ['/admin/vacantes',     'Vacantes'],
          ['/admin/certificados', 'Certificados'],
          ['/admin/mensajes',     'Mensajes'],
          ['/admin/opiniones',    'Opiniones'],
          ['/admin/auditoria',    'Auditoría'],
          ['/admin/configuracion','Configuración'],
        ].map(([href, label]) => (
          <Link key={href} href={href}
            className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
            {label}
          </Link>
        ))}
      </div>

      {recentApps.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-neutral-800">Aplicaciones recientes</h2>
            <Link href="/admin/aplicaciones" className="text-xs text-[#2FB7A3] font-medium hover:underline">Ver todas →</Link>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            {recentApps.map((app, i) => (
              <div key={app.id}
                className={`flex items-center justify-between px-5 py-3 ${i < recentApps.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{app.therapist_name}</p>
                  <p className="text-xs text-neutral-400">{app.vacancy_title}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CHIP[app.status] ?? 'text-neutral-500 bg-neutral-100'}`}>
                  {STATUS_LABEL[app.status] ?? app.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
