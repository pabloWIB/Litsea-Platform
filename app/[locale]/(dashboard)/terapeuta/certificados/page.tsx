import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle2, Clock } from 'lucide-react'
import CertificadoForm from '@/components/terapeuta/CertificadoForm'

export const metadata: Metadata = {
  title: 'Mis certificados — Litsea Empleos',
  robots: { index: false },
}

type CertRow = {
  id: string
  title: string
  issued_by: string
  issued_at: string | null
  verified: boolean
  created_at: string
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date(d))
}

export default async function TerapeutaCertificadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let tpId        = ''
  let certs: CertRow[] = []

  try {
    const { data: tp } = await supabase
      .from('therapist_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (tp) {
      tpId = tp.id
      const { data } = await supabase
        .from('certificates')
        .select('id, title, issued_by, issued_at, verified, created_at')
        .eq('therapist_id', tp.id)
        .order('created_at', { ascending: false })
      certs = (data ?? []) as CertRow[]
    }
  } catch {  }

  if (!tpId) redirect('/terapeuta/dashboard')

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">

      <div>
        <h1 className="text-2xl font-black text-neutral-900">Mis certificados</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Sube tus certificados de Litsea para que el equipo los verifique y aparezcan en tu perfil.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="text-[15px] font-bold text-neutral-900 mb-4">Subir nuevo certificado</h2>
        <CertificadoForm therapistProfileId={tpId} />
      </div>

      <div>
        <h2 className="text-[15px] font-bold text-neutral-900 mb-4">
          Certificados subidos{' '}
          <span className="text-sm font-normal text-neutral-400">({certs.length})</span>
        </h2>

        {certs.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-2xl">
            Aún no has subido ningún certificado.
          </div>
        ) : (
          <div className="space-y-3">
            {certs.map(cert => (
              <div key={cert.id}
                className="flex items-start gap-4 bg-white border border-neutral-200 rounded-2xl p-4">

                <div className={`mt-0.5 size-8 rounded-xl flex items-center justify-center shrink-0 ${
                  cert.verified
                    ? 'bg-[#2FB7A3]/10 text-[#2FB7A3]'
                    : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {cert.verified
                    ? <CheckCircle2 className="size-4" />
                    : <Clock className="size-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 truncate">{cert.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {cert.issued_by}
                    {cert.issued_at && ` · ${formatDate(cert.issued_at)}`}
                  </p>
                </div>

                <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  cert.verified
                    ? 'bg-[#2FB7A3]/10 text-[#2FB7A3] border-[#2FB7A3]/20'
                    : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                }`}>
                  {cert.verified ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
