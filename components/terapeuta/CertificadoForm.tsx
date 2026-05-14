'use client'

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, CheckCircle2, FileText } from 'lucide-react'

interface Props {
  therapistProfileId: string
}

type FormState = 'idle' | 'uploading' | 'success' | 'error'

export default function CertificadoForm({ therapistProfileId }: Props) {
  const router    = useRouter()
  const supabase  = createClient()
  const fileRef   = useRef<HTMLInputElement>(null)

  const [title,     setTitle]     = useState('')
  const [issuedAt,  setIssuedAt]  = useState('')
  const [file,      setFile]      = useState<File | null>(null)
  const [state,     setState]     = useState<FormState>('idle')
  const [errorMsg,  setErrorMsg]  = useState('')

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setErrorMsg('El nombre del curso es requerido.'); return }
    if (!file)         { setErrorMsg('Selecciona un archivo PDF.'); return }
    if (file.size > 10 * 1024 * 1024) { setErrorMsg('El archivo no debe superar 10 MB.'); return }

    setState('uploading')
    setErrorMsg('')

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path     = `${therapistProfileId}/${Date.now()}-${safeName}`

      const { error: uploadErr } = await supabase.storage
        .from('certificates')
        .upload(path, file)

      if (uploadErr) throw uploadErr

      const { error: dbErr } = await supabase.from('certificates').insert({
        therapist_id: therapistProfileId,
        title:        title.trim(),
        issued_by:    'Litsea Centro de Capacitación',
        issued_at:    issuedAt || null,
        file_url:     path,   
        verified:     false,
      })

      if (dbErr) throw dbErr

      setState('success')
      setTitle('')
      setIssuedAt('')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''

      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el certificado.'
      setErrorMsg(msg.includes('storage') || msg.includes('bucket')
        ? 'El almacenamiento de archivos no está configurado. Configura el bucket "certificates" en Supabase.'
        : 'Error al subir el certificado. Intenta de nuevo.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
        <div className="size-12 rounded-full bg-[#2FB7A3]/10 flex items-center justify-center">
          <CheckCircle2 className="size-6 text-[#2FB7A3]" />
        </div>
        <p className="text-sm font-semibold text-neutral-800">¡Certificado subido!</p>
        <p className="text-xs text-neutral-500">El equipo Litsea lo revisará pronto.</p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-2 text-sm font-semibold text-[#2FB7A3] hover:underline"
        >
          Subir otro
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Nombre del curso <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ej. Masoterapia Sueca Avanzada"
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Fecha de emisión <span className="text-neutral-400 font-normal">(opcional)</span>
        </label>
        <input
          type="date"
          value={issuedAt}
          onChange={e => setIssuedAt(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-48 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Archivo PDF <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className={`flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 cursor-pointer transition-colors ${
            file
              ? 'border-[#2FB7A3]/40 bg-[#2FB7A3]/5'
              : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400'
          }`}
        >
          {file ? (
            <>
              <FileText className="size-5 text-[#2FB7A3] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">{file.name}</p>
                <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="size-5 text-neutral-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-700">Haz clic para seleccionar</p>
                <p className="text-xs text-neutral-400">PDF · Máx. 10 MB</p>
              </div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
      </div>

      {errorMsg && (
        <p className="text-sm font-medium text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === 'uploading'}
        className="flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3] disabled:opacity-60"
      >
        {state === 'uploading'
          ? <><Loader2 className="size-4 animate-spin" /> Subiendo...</>
          : <><Upload className="size-4" /> Subir certificado</>}
      </button>
    </form>
  )
}
