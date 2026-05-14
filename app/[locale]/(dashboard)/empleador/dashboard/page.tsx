import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, Users, UserCheck, Plus, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard empleador — Litsea Empleos',
  robots: { index: false },
}

export default async function EmpleadorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let companyName   = ''
  let epId          = ''
  let vacantesCount = 0
  let candidatosCount = 0
  let contratadosCount = 0

  try {
    const { data: ep } = await supabase
      .from('employer_profiles')
      .select('id, company_name')
      .eq('user_id', user.id)
      .single()

    if (ep) {
      epId        = ep.id
      companyName = ep.company_name

      const [vacRes, candidatosRes, contratadosRes] = await Promise.all([
        supabase
          .from('vacancies')
          .select('*', { count: 'exact', head: true })
          .eq('employer_id', epId)
          .eq('is_active', true),
        supabase
          .from('applications')
          .select('*, vacancies!inner(employer_id)', { count: 'exact', head: true })
          .eq('vacancies.employer_id', epId)
          .neq('status', 'rejected'),
        supabase
          .from('applications')
          .select('*, vacancies!inner(employer_id)', { count: 'exact', head: true })
          .eq('vacancies.employer_id', epId)
          .eq('status', 'hired'),
      ])

      vacantesCount    = vacRes.count ?? 0
      candidatosCount  = candidatosRes.count ?? 0
      contratadosCount = contratadosRes.count ?? 0
    }
  } catch {  }

  const displayName = companyName || 'Empleador'

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black text-neutral-900">
          Bienvenido, {displayName}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">Panel de control de empleador</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <MetricCard
          icon={<Briefcase className="size-5" />}
          label="Vacantes activas"
          value={vacantesCount}
          href="/empleador/vacantes"
          cta="Ver mis vacantes →"
        />
        <MetricCard
          icon={<Users className="size-5" />}
          label="Candidatos recibidos"
          value={candidatosCount}
          href="/empleador/candidatos"
          cta="Ver candidatos →"
        />
        <MetricCard
          icon={<UserCheck className="size-5" />}
          label="Terapeutas contratados"
          value={contratadosCount}
          href="/empleador/candidatos"
          cta="Ver historial →"
          highlight={contratadosCount > 0}
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="text-[15px] font-bold text-neutral-900 mb-4">Acceso rápido</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/empleador/vacantes/nueva"
            className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3]"
          >
            <Plus className="size-4" />
            Nueva vacante
          </Link>
          <Link
            href="/empleador/candidatos"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Users className="size-4" />
            Ver candidatos
          </Link>
          <Link
            href="/empleador/mensajes"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <MessageCircle className="size-4" />
            Mensajes
          </Link>
        </div>
      </div>

    </div>
  )
}

function MetricCard({
  icon, label, value, href, cta, highlight = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  href: string
  cta: string
  highlight?: boolean
}) {
  return (
    <div className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 ${
      highlight ? 'border-[#2FB7A3]/30' : 'border-neutral-200'
    }`}>
      <div className={`size-10 rounded-xl flex items-center justify-center ${
        highlight ? 'bg-[#2FB7A3]/10 text-[#2FB7A3]' : 'bg-neutral-100 text-neutral-500'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-neutral-900 tabular-nums">{value}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
      </div>
      <Link href={href} className="text-xs font-semibold text-[#2FB7A3] hover:underline mt-auto">
        {cta}
      </Link>
    </div>
  )
}
