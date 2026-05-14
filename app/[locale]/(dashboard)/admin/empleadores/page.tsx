import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Empleadores — Admin',
  robots: { index: false },
}

type ERow = {
  ep_id: string
  user_id: string
  full_name: string
  email: string
  company_name: string
  website: string | null
  is_active: boolean
  vacancies_count: number
  created_at: string
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function AdminEmpleadoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let empleadores: ERow[] = []

  try {
    const { data: eps } = await supabase
      .from('employer_profiles')
      .select(`
        id, company_name, website, created_at,
        profiles!user_id(id, full_name, email, is_active)
      `)
      .order('created_at', { ascending: false })

    const epIds = (eps ?? []).map((e: any) => e.id)

    const { data: vcounts } = await supabase
      .from('vacancies')
      .select('employer_id')
      .in('employer_id', epIds)
      .eq('is_active', true)

    const countMap: Record<string, number> = {}
    for (const v of vcounts ?? []) {
      countMap[v.employer_id] = (countMap[v.employer_id] ?? 0) + 1
    }

    empleadores = (eps ?? []).map((e: any) => {
      const pr = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles
      return {
        ep_id:           e.id,
        user_id:         pr?.id ?? '',
        full_name:       pr?.full_name ?? 'Empleador',
        email:           pr?.email ?? '',
        company_name:    e.company_name,
        website:         e.website,
        is_active:       pr?.is_active ?? true,
        vacancies_count: countMap[e.id] ?? 0,
        created_at:      e.created_at,
      }
    }).filter(e => {
      if (!q) return true
      const s = q.toLowerCase()
      return e.full_name.toLowerCase().includes(s) || e.email.toLowerCase().includes(s) || e.company_name.toLowerCase().includes(s)
    })
  } catch {  }

  async function toggleActive(userId: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ is_active: !current }).eq('id', userId)
    await logAudit(user.id, current ? 'suspend_employer' : 'reactivate_employer', 'profiles', userId)
    revalidatePath('/admin/empleadores')
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Empleadores</h1>
        <p className="text-sm text-neutral-500 mt-1">{empleadores.length} empresa{empleadores.length !== 1 ? 's' : ''}</p>
      </div>

      <form method="GET" className="flex gap-3 mb-6">
        <input name="q" defaultValue={q ?? ''} placeholder="Buscar por nombre, email o empresa…"
          className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]" />
        <button type="submit"
          className="rounded-xl bg-[#2FB7A3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27a090] transition-colors">
          Filtrar
        </button>
      </form>

      {empleadores.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-neutral-500">No se encontraron empleadores.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {empleadores.map(e => (
            <div key={e.ep_id}
              className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${!e.is_active ? 'border-red-200 bg-red-50/30' : 'border-neutral-200'}`}>

              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="size-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                  <Building2 className="size-5 text-neutral-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[15px] font-bold text-neutral-900">{e.company_name}</p>
                    {!e.is_active && (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Suspendido</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{e.full_name} · {e.email}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {e.vacancies_count} vacante{e.vacancies_count !== 1 ? 's' : ''} activa{e.vacancies_count !== 1 ? 's' : ''} · Registro: {formatDate(e.created_at)}
                  </p>
                  {e.website && (
                    <a href={e.website} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#2FB7A3] hover:underline mt-0.5 inline-block">
                      {e.website}
                    </a>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <form action={toggleActive.bind(null, e.user_id, e.is_active)}>
                  <button type="submit"
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      e.is_active
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}>
                    {e.is_active ? 'Suspender' : 'Reactivar'}
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
