import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { Star } from 'lucide-react'
import type { OpinionStatus } from '@/types/database'

export const metadata: Metadata = {
  title: 'Opiniones — Admin',
  robots: { index: false },
}

type OpRow = {
  id: string
  nombre: string
  cargo: string | null
  empresa: string | null
  contenido: string
  rating: number
  status: OpinionStatus
  created_at: string
}

const TABS: { value: OpinionStatus | 'all'; label: string }[] = [
  { value: 'pending',  label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
  { value: 'all',      label: 'Todas' },
]

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function AdminOpinionesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'pending' } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let opiniones: OpRow[] = []

  try {
    let query = supabase
      .from('opiniones')
      .select('id, nombre, cargo, empresa, contenido, rating, status, created_at')
      .order('created_at', { ascending: false })

    if (tab !== 'all') {
      query = query.eq('status', tab as OpinionStatus)
    }

    const { data } = await query
    opiniones = (data ?? []) as OpRow[]
  } catch {  }

  async function approveOpinion(id: string) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('opiniones').update({
      status:       'approved',
      revisado_by:  user.id,
      revisado_at:  new Date().toISOString(),
    }).eq('id', id)
    await logAudit(user.id, 'approve_opinion', 'opiniones', id)
    revalidatePath('/admin/opiniones')
  }

  async function rejectOpinion(id: string) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('opiniones').update({
      status:       'rejected',
      revisado_by:  user.id,
      revisado_at:  new Date().toISOString(),
    }).eq('id', id)
    await logAudit(user.id, 'reject_opinion', 'opiniones', id)
    revalidatePath('/admin/opiniones')
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Opiniones</h1>
        <p className="text-sm text-neutral-500 mt-1">Modera los testimonios del landing.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-neutral-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <a key={t.value} href={`/admin/opiniones?tab=${t.value}`}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t.value
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}>
            {t.label}
          </a>
        ))}
      </div>

      {opiniones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <Star className="size-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">No hay opiniones{tab !== 'all' ? ` ${TABS.find(t => t.value === tab)?.label.toLowerCase()}` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opiniones.map(op => (
            <div key={op.id}
              className={`bg-white border rounded-2xl p-5 ${
                op.status === 'pending'  ? 'border-yellow-200' :
                op.status === 'approved' ? 'border-emerald-200' :
                'border-neutral-200'
              }`}>

              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-neutral-900">{op.nombre}</p>
                    {op.cargo && <span className="text-xs text-neutral-400">{op.cargo}</span>}
                    {op.empresa && <span className="text-xs text-neutral-400">· {op.empresa}</span>}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3.5 ${i < op.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                    ))}
                    <span className="text-xs text-neutral-400 ml-1">{formatDate(op.created_at)}</span>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  op.status === 'pending'  ? 'bg-yellow-50 text-yellow-700' :
                  op.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-neutral-100 text-neutral-500'
                }`}>
                  {op.status === 'pending' ? 'Pendiente' : op.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                </span>
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed mb-4">{op.contenido}</p>

              <div className="flex gap-2">
                {op.status !== 'approved' && (
                  <form action={approveOpinion.bind(null, op.id)}>
                    <button type="submit"
                      className="px-4 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors">
                      Aprobar
                    </button>
                  </form>
                )}
                {op.status !== 'rejected' && (
                  <form action={rejectOpinion.bind(null, op.id)}>
                    <button type="submit"
                      className="px-4 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 text-xs font-semibold hover:bg-neutral-50 transition-colors">
                      Rechazar
                    </button>
                  </form>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
