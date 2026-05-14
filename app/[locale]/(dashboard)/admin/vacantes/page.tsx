import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { Eye, EyeOff, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vacantes — Admin',
  robots: { index: false },
}

type VRow = {
  id: string
  title: string
  location: string
  contract_type: string
  is_active: boolean
  is_featured: boolean
  company_name: string
  created_at: string
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function AdminVacantesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string }>
}) {
  const { q, estado } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let vacantes: VRow[] = []

  try {
    let query = supabase
      .from('vacancies')
      .select(`
        id, title, location, contract_type, is_active, is_featured, created_at,
        employer:employer_profiles!employer_id(company_name)
      `)
      .order('created_at', { ascending: false })

    if (estado === 'active')   query = query.eq('is_active', true)
    if (estado === 'inactive') query = query.eq('is_active', false)
    if (estado === 'featured') query = query.eq('is_featured', true)

    const { data } = await query

    vacantes = (data ?? []).map((v: any) => {
      const emp = Array.isArray(v.employer) ? v.employer[0] : v.employer
      return { ...v, company_name: emp?.company_name ?? 'Empresa' }
    }).filter((v: VRow) => {
      if (!q) return true
      const s = q.toLowerCase()
      return v.title.toLowerCase().includes(s) || v.company_name.toLowerCase().includes(s)
    })
  } catch {  }

  async function toggleActive(id: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('vacancies').update({ is_active: !current }).eq('id', id)
    await logAudit(user.id, current ? 'deactivate_vacancy' : 'activate_vacancy', 'vacancies', id)
    revalidatePath('/admin/vacantes')
  }

  async function toggleFeatured(id: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('vacancies').update({ is_featured: !current }).eq('id', id)
    await logAudit(user.id, current ? 'unfeature_vacancy' : 'feature_vacancy', 'vacancies', id)
    revalidatePath('/admin/vacantes')
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Vacantes</h1>
        <p className="text-sm text-neutral-500 mt-1">{vacantes.length} vacante{vacantes.length !== 1 ? 's' : ''}</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input name="q" defaultValue={q ?? ''} placeholder="Buscar por título o empresa…"
          className="flex-1 min-w-48 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]" />
        <select name="estado" defaultValue={estado ?? ''}
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]">
          <option value="">Todas</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
          <option value="featured">Destacadas</option>
        </select>
        <button type="submit"
          className="rounded-xl bg-[#2FB7A3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27a090] transition-colors">
          Filtrar
        </button>
      </form>

      {vacantes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-neutral-500">No se encontraron vacantes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vacantes.map(v => (
            <div key={v.id}
              className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block size-2 rounded-full shrink-0 ${v.is_active ? 'bg-[#2FB7A3]' : 'bg-neutral-300'}`} />
                  <span className="text-xs text-neutral-500">
                    {v.is_active ? 'Activa' : 'Inactiva'}
                    {v.is_featured && ' · ⭐ Destacada'}
                  </span>
                </div>
                <h2 className="text-[15px] font-bold text-neutral-900 truncate">{v.title}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {v.company_name} · {v.location} · {v.contract_type} · {formatDate(v.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <form action={toggleFeatured.bind(null, v.id, v.is_featured)}>
                  <button type="submit"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      v.is_featured
                        ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}>
                    <Star className="size-3" />
                    {v.is_featured ? 'Quitar destaque' : 'Destacar'}
                  </button>
                </form>

                <form action={toggleActive.bind(null, v.id, v.is_active)}>
                  <button type="submit"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      v.is_active
                        ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        : 'border-[#2FB7A3]/30 text-[#2FB7A3] hover:bg-[#2FB7A3]/5'
                    }`}>
                    {v.is_active
                      ? <><EyeOff className="size-3" /> Desactivar</>
                      : <><Eye className="size-3" /> Activar</>}
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
