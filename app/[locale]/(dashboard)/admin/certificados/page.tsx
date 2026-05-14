import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { CheckCircle2, XCircle, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Certificados — Admin',
  robots: { index: false },
}

type CertRow = {
  id: string
  title: string
  issued_by: string
  issued_at: string | null
  file_url: string
  verified: boolean
  therapist_id: string
  therapist_name: string
  therapist_email: string
  created_at: string
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
}

export default async function AdminCertificadosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>
}) {
  const { estado } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let certs: CertRow[] = []

  try {
    let query = supabase
      .from('certificates')
      .select(`
        id, title, issued_by, issued_at, file_url, verified, created_at,
        therapist:therapist_profiles!therapist_id(id, profiles!user_id(full_name, email))
      `)
      .order('created_at', { ascending: false })

    if (estado === 'pending')  query = query.eq('verified', false)
    if (estado === 'verified') query = query.eq('verified', true)

    const { data } = await query

    certs = (data ?? []).map((c: any) => {
      const tp = Array.isArray(c.therapist) ? c.therapist[0] : c.therapist
      const pr = Array.isArray(tp?.profiles) ? tp?.profiles[0] : tp?.profiles
      return {
        id:              c.id,
        title:           c.title,
        issued_by:       c.issued_by,
        issued_at:       c.issued_at,
        file_url:        c.file_url,
        verified:        c.verified,
        therapist_id:    tp?.id ?? '',
        therapist_name:  pr?.full_name ?? 'Terapeuta',
        therapist_email: pr?.email ?? '',
        created_at:      c.created_at,
      }
    })
  } catch {  }

  async function verifyCert(certId: string, therapistId: string) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('certificates').update({ verified: true }).eq('id', certId)
    await logAudit(user.id, 'verify_certificate', 'certificates', certId, { therapist_id: therapistId })
    revalidatePath('/admin/certificados')
  }

  async function rejectCert(certId: string, therapistId: string) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('certificates').update({ verified: false }).eq('id', certId)
    await logAudit(user.id, 'reject_certificate', 'certificates', certId, { therapist_id: therapistId })
    revalidatePath('/admin/certificados')
  }

  async function getSignedUrl(filePath: string) {
    'use server'
    const supabase = await createClient()
    const { data } = await supabase.storage.from('certificates').createSignedUrl(filePath, 3600)
    return data?.signedUrl ?? null
  }

  const showFilter = estado ?? 'pending'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Certificados</h1>
        <p className="text-sm text-neutral-500 mt-1">{certs.length} certificado{certs.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { value: 'pending',  label: 'Pendientes' },
          { value: 'verified', label: 'Verificados' },
          { value: '',         label: 'Todos' },
        ].map(tab => (
          <a key={tab.value}
            href={tab.value ? `/admin/certificados?estado=${tab.value}` : '/admin/certificados'}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              showFilter === tab.value || (!estado && tab.value === 'pending')
                ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            }`}>
            {tab.label}
          </a>
        ))}
      </div>

      {certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <FileText className="size-6 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">No hay certificados{showFilter === 'pending' ? ' pendientes de revisión' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map(cert => (
            <div key={cert.id}
              className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">

              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${cert.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-400'}`}>
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-neutral-900">{cert.title}</p>
                  <p className="text-xs text-neutral-500">{cert.issued_by} · Expedido: {formatDate(cert.issued_at)}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{cert.therapist_name} · {cert.therapist_email}</p>
                  <p className="text-xs text-neutral-300 mt-0.5">Subido: {formatDate(cert.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a href={`/admin/certificados/${cert.id}/ver`} target="_blank"
                  className="text-xs font-medium text-[#2FB7A3] hover:underline">
                  Ver archivo →
                </a>

                {!cert.verified && (
                  <form action={verifyCert.bind(null, cert.id, cert.therapist_id)}>
                    <button type="submit"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 text-xs font-medium hover:bg-emerald-50 transition-colors">
                      <CheckCircle2 className="size-3" /> Verificar
                    </button>
                  </form>
                )}

                {cert.verified && (
                  <form action={rejectCert.bind(null, cert.id, cert.therapist_id)}>
                    <button type="submit"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors">
                      <XCircle className="size-3" /> Desverificar
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
