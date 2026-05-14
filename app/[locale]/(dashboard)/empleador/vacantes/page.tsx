import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, Plus, Users, Eye, EyeOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mis vacantes — Litsea Empleos',
  robots: { index: false },
}

type VacancyRow = {
  id: string
  title: string
  location: string
  contract_type: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  _count?: number
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function EmpleadorVacantesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let epId      = ''
  let vacancies: VacancyRow[] = []

  try {
    const { data: ep } = await supabase
      .from('employer_profiles').select('id').eq('user_id', user.id).single()

    if (ep) {
      epId = ep.id
      const { data } = await supabase
        .from('vacancies')
        .select('id, title, location, contract_type, is_active, is_featured, created_at')
        .eq('employer_id', epId)
        .order('created_at', { ascending: false })
      vacancies = (data ?? []) as VacancyRow[]
    }
  } catch { }

  async function toggleActive(vacancyId: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    await supabase.from('vacancies').update({ is_active: !current }).eq('id', vacancyId)
    revalidatePath('/empleador/vacantes')
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Mis vacantes</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {vacancies.length} vacante{vacancies.length !== 1 ? 's' : ''} publicada{vacancies.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/empleador/vacantes/nueva"
          className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3]">
          <Plus className="size-4" />
          Nueva vacante
        </Link>
      </div>

      {vacancies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <Briefcase className="size-6 text-neutral-400" />
          </div>
          <h3 className="text-base font-semibold text-neutral-800 mb-1">
            Aún no has publicado vacantes
          </h3>
          <p className="text-sm text-neutral-500 max-w-xs mb-5">
            Publica tu primera oferta y empieza a recibir candidatos calificados.
          </p>
          <Link href="/empleador/vacantes/nueva"
            className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3]">
            <Plus className="size-4" />
            Publicar primera vacante
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {vacancies.map(v => (
            <div key={v.id}
              className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-neutral-300 transition-colors">

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block size-2 rounded-full shrink-0 ${v.is_active ? 'bg-[#2FB7A3]' : 'bg-neutral-300'}`} />
                  <span className="text-xs font-semibold text-neutral-500">
                    {v.is_active ? 'Activa' : 'Inactiva'}
                    {v.is_featured && ' · Destacada ⭐'}
                  </span>
                </div>
                <h2 className="text-[15px] font-bold text-neutral-900 truncate">{v.title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {v.location} · {v.contract_type} · Publicada {formatDate(v.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/empleador/candidatos?vacante=${v.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  <Users className="size-3.5" />
                  Candidatos
                </Link>

                <Link href={`/empleador/vacantes/${v.id}/editar`}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  Editar
                </Link>

                <form action={toggleActive.bind(null, v.id, v.is_active)}>
                  <button type="submit"
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      v.is_active
                        ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        : 'border-[#2FB7A3]/30 text-[#2FB7A3] hover:bg-[#2FB7A3]/5'
                    }`}>
                    {v.is_active
                      ? <span className="flex items-center gap-1"><EyeOff className="size-3" /> Desactivar</span>
                      : <span className="flex items-center gap-1"><Eye className="size-3" /> Activar</span>}
                  </button>
                </form>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
