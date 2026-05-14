import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { CheckCircle2, XCircle, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terapeutas — Admin',
  robots: { index: false },
}

type TRow = {
  tp_id: string
  user_id: string
  full_name: string
  email: string
  slug: string | null
  specialties: string[]
  experience_years: number
  is_verified: boolean
  is_litsea_grad: boolean
  is_active: boolean
  created_at: string
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function AdminTerapeutasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; verified?: string }>
}) {
  const { q, verified } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let terapeutas: TRow[] = []

  try {
    const { data } = await supabase
      .from('therapist_profiles')
      .select(`
        id, slug, specialties, experience_years, is_verified, is_litsea_grad, created_at,
        profiles!user_id(id, full_name, email, is_active)
      `)
      .order('created_at', { ascending: false })

    terapeutas = (data ?? []).map((t: any) => {
      const pr = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles
      return {
        tp_id:           t.id,
        user_id:         pr?.id ?? '',
        full_name:       pr?.full_name ?? 'Terapeuta',
        email:           pr?.email ?? '',
        slug:            t.slug,
        specialties:     t.specialties ?? [],
        experience_years: t.experience_years ?? 0,
        is_verified:     t.is_verified ?? false,
        is_litsea_grad:  t.is_litsea_grad ?? false,
        is_active:       pr?.is_active ?? true,
        created_at:      t.created_at,
      }
    }).filter(t => {
      if (q) {
        const search = q.toLowerCase()
        if (!t.full_name.toLowerCase().includes(search) && !t.email.toLowerCase().includes(search)) return false
      }
      if (verified === 'yes' && !t.is_verified) return false
      if (verified === 'no'  &&  t.is_verified) return false
      return true
    })
  } catch {  }

  async function toggleVerified(tpId: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('therapist_profiles').update({ is_verified: !current }).eq('id', tpId)
    await logAudit(user.id, current ? 'unverify_therapist' : 'verify_therapist', 'therapist_profiles', tpId)
    revalidatePath('/admin/terapeutas')
  }

  async function toggleGrad(tpId: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('therapist_profiles').update({ is_litsea_grad: !current }).eq('id', tpId)
    await logAudit(user.id, current ? 'remove_grad' : 'mark_grad', 'therapist_profiles', tpId)
    revalidatePath('/admin/terapeutas')
  }

  async function toggleActive(userId: string, current: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ is_active: !current }).eq('id', userId)
    await logAudit(user.id, current ? 'suspend_user' : 'reactivate_user', 'profiles', userId)
    revalidatePath('/admin/terapeutas')
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Terapeutas</h1>
        <p className="text-sm text-neutral-500 mt-1">{terapeutas.length} terapeuta{terapeutas.length !== 1 ? 's' : ''}</p>
      </div>

      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input name="q" defaultValue={q ?? ''} placeholder="Buscar por nombre o email…"
          className="flex-1 min-w-48 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]" />
        <select name="verified" defaultValue={verified ?? ''}
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]">
          <option value="">Todos</option>
          <option value="yes">Verificados</option>
          <option value="no">Sin verificar</option>
        </select>
        <button type="submit"
          className="rounded-xl bg-[#2FB7A3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27a090] transition-colors">
          Filtrar
        </button>
      </form>

      {terapeutas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-neutral-500">No se encontraron terapeutas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {terapeutas.map(t => (
            <div key={t.tp_id}
              className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${!t.is_active ? 'border-red-200 bg-red-50/30' : 'border-neutral-200'}`}>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-[15px] font-bold text-neutral-900">{t.full_name}</p>
                  {t.is_verified && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#2FB7A3] uppercase tracking-wide">
                      <CheckCircle2 className="size-3" /> Verificado
                    </span>
                  )}
                  {t.is_litsea_grad && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                      <Award className="size-3" /> Egresado
                    </span>
                  )}
                  {!t.is_active && (
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Suspendido</span>
                  )}
                </div>
                <p className="text-xs text-neutral-400">{t.email}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.specialties.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">{s}</span>
                  ))}
                  {t.specialties.length > 3 && (
                    <span className="text-[10px] text-neutral-400">+{t.specialties.length - 3}</span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">{t.experience_years} años · Registro: {formatDate(t.created_at)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {t.slug && (
                  <Link href={`/terapeutas/${t.slug}`} target="_blank"
                    className="text-xs font-medium text-[#2FB7A3] hover:underline">Ver perfil →</Link>
                )}

                <form action={toggleVerified.bind(null, t.tp_id, t.is_verified)}>
                  <button type="submit"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      t.is_verified
                        ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        : 'border-[#2FB7A3]/30 text-[#2FB7A3] hover:bg-[#2FB7A3]/5'
                    }`}>
                    <CheckCircle2 className="size-3" />
                    {t.is_verified ? 'Desverificar' : 'Verificar'}
                  </button>
                </form>

                <form action={toggleGrad.bind(null, t.tp_id, t.is_litsea_grad)}>
                  <button type="submit"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      t.is_litsea_grad
                        ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                        : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                    }`}>
                    <Award className="size-3" />
                    {t.is_litsea_grad ? 'Quitar egresado' : 'Marcar egresado'}
                  </button>
                </form>

                <form action={toggleActive.bind(null, t.user_id, t.is_active)}>
                  <button type="submit"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      t.is_active
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                    }`}>
                    <XCircle className="size-3" />
                    {t.is_active ? 'Suspender' : 'Reactivar'}
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
