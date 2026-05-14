import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClipboardList } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Auditoría — Admin',
  robots: { index: false },
}

type LogRow = {
  id: string
  action: string
  module: string
  record_id: string | null
  details: Record<string, unknown> | null
  admin_name: string
  created_at: string
}

const MODULE_LABELS: Record<string, string> = {
  applications:       'Aplicaciones',
  therapist_profiles: 'Terapeutas',
  profiles:           'Usuarios',
  vacancies:          'Vacantes',
  certificates:       'Certificados',
  opiniones:          'Opiniones',
  settings:           'Configuración',
}

const ACTION_CHIP: Record<string, string> = {
  update_status:       'bg-blue-50 text-blue-700',
  verify_therapist:    'bg-emerald-50 text-emerald-700',
  unverify_therapist:  'bg-neutral-100 text-neutral-600',
  mark_grad:           'bg-amber-50 text-amber-700',
  remove_grad:         'bg-neutral-100 text-neutral-600',
  suspend_user:        'bg-red-50 text-red-700',
  reactivate_user:     'bg-emerald-50 text-emerald-700',
  suspend_employer:    'bg-red-50 text-red-700',
  reactivate_employer: 'bg-emerald-50 text-emerald-700',
  verify_certificate:  'bg-emerald-50 text-emerald-700',
  reject_certificate:  'bg-red-50 text-red-700',
  approve_opinion:     'bg-emerald-50 text-emerald-700',
  reject_opinion:      'bg-red-50 text-red-700',
  feature_vacancy:     'bg-amber-50 text-amber-700',
  unfeature_vacancy:   'bg-neutral-100 text-neutral-600',
  activate_vacancy:    'bg-emerald-50 text-emerald-700',
  deactivate_vacancy:  'bg-neutral-100 text-neutral-600',
  update_setting:      'bg-blue-50 text-blue-700',
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}

export default async function AdminAuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; page?: string }>
}) {
  const { module: mod, page: pageStr } = await searchParams
  const page  = Math.max(1, parseInt(pageStr ?? '1', 10))
  const limit = 30
  const from  = (page - 1) * limit

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let logs: LogRow[] = []
  let totalCount = 0

  try {
    let query = supabase
      .from('audit_logs')
      .select(`
        id, action, module, record_id, details, created_at,
        admin:profiles!admin_id(full_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1)

    if (mod) query = query.eq('module', mod)

    const { data, count } = await query

    totalCount = count ?? 0
    logs = (data ?? []).map((l: any) => {
      const admin = Array.isArray(l.admin) ? l.admin[0] : l.admin
      return {
        id:         l.id,
        action:     l.action,
        module:     l.module,
        record_id:  l.record_id,
        details:    l.details,
        admin_name: admin?.full_name ?? 'Sistema',
        created_at: l.created_at,
      }
    })
  } catch {  }

  const totalPages = Math.ceil(totalCount / limit)
  const modules    = Object.keys(MODULE_LABELS)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Auditoría</h1>
        <p className="text-sm text-neutral-500 mt-1">{totalCount} registro{totalCount !== 1 ? 's' : ''} en total</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/admin/auditoria"
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            !mod ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
          }`}>
          Todos
        </a>
        {modules.map(m => (
          <a key={m} href={`/admin/auditoria?module=${m}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              mod === m ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}>
            {MODULE_LABELS[m]}
          </a>
        ))}
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <ClipboardList className="size-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">No hay registros de auditoría.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            {logs.map((log, i) => (
              <div key={log.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3 ${i < logs.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ACTION_CHIP[log.action] ?? 'bg-neutral-100 text-neutral-600'}`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {MODULE_LABELS[log.module] ?? log.module}
                    </span>
                  </div>
                  {log.record_id && (
                    <p className="text-[11px] text-neutral-400 mt-0.5 font-mono truncate">ID: {log.record_id}</p>
                  )}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-neutral-700">{log.admin_name}</p>
                  <p className="text-[11px] text-neutral-400">{formatDate(log.created_at)}</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {page > 1 && (
                <a href={`/admin/auditoria?${mod ? `module=${mod}&` : ''}page=${page - 1}`}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  ← Anterior
                </a>
              )}
              <span className="text-xs text-neutral-500">Página {page} de {totalPages}</span>
              {page < totalPages && (
                <a href={`/admin/auditoria?${mod ? `module=${mod}&` : ''}page=${page + 1}`}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                  Siguiente →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
