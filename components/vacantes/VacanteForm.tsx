'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { SPECIALTIES, ZONES, CONTRACT_TYPES, POSITION_TYPES } from '@/types/database'
import { Loader2 } from 'lucide-react'

export interface VacanteFormData {
  title: string
  description: string
  location: string
  position_type: string
  contract_type: string
  specialties: string[]
}

interface Props {
  action: (data: VacanteFormData, publish: boolean) => Promise<void>
  initial?: Partial<VacanteFormData>
  mode?: 'create' | 'edit'
}

export default function VacanteForm({ action, initial, mode = 'create' }: Props) {
  const router = useRouter()

  const [title,        setTitle]        = useState(initial?.title ?? '')
  const [description,  setDescription]  = useState(initial?.description ?? '')
  const [location,     setLocation]     = useState(initial?.location ?? '')
  const [positionType, setPositionType] = useState(initial?.position_type ?? '')
  const [contractType, setContractType] = useState(initial?.contract_type ?? CONTRACT_TYPES[0])
  const [specialties,  setSpecialties]  = useState<string[]>(initial?.specialties ?? [])
  const [saving,       setSaving]       = useState<'draft' | 'publish' | null>(null)
  const [error,        setError]        = useState('')

  const toggle = (s: string) =>
    setSpecialties(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const submit = async (e: FormEvent, publish: boolean) => {
    e.preventDefault()
    if (!title.trim())       { setError('El título es requerido.'); return }
    if (!description.trim()) { setError('La descripción es requerida.'); return }
    if (!location)           { setError('Selecciona una ubicación.'); return }
    if (!specialties.length) { setError('Selecciona al menos una especialidad.'); return }

    setSaving(publish ? 'publish' : 'draft')
    setError('')

    try {
      await action({ title: title.trim(), description: description.trim(), location, position_type: positionType, contract_type: contractType, specialties }, publish)
      router.push('/empleador/vacantes')
      router.refresh()
    } catch {
      setError('Error al guardar la vacante. Intenta de nuevo.')
      setSaving(null)
    }
  }

  return (
    <form className="space-y-6" onSubmit={e => e.preventDefault()}>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Título del puesto <span className="text-red-500">*</span>
        </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Ej. Terapeuta de Masajes Sueco"
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Descripción <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-neutral-400 mb-2">
          Incluye requisitos, horarios, prestaciones y expectativas del puesto.
        </p>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          rows={6} maxLength={2000}
          placeholder="Buscamos terapeuta certificado en masaje sueco para nuestro spa de clase mundial..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent resize-none"
        />
        <p className="text-xs text-neutral-400 text-right mt-1 tabular-nums">
          {description.length}/2000
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Ubicación <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select value={location} onChange={e => setLocation(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent">
              <option value="">Selecciona zona</option>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-40">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Tipo de posición
          </label>
          <div className="relative">
            <select value={positionType} onChange={e => setPositionType(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent">
              <option value="">Selecciona tipo</option>
              {POSITION_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-40">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          Tipo de contrato <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {CONTRACT_TYPES.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="contract" value={c}
                checked={contractType === c}
                onChange={() => setContractType(c)}
                className="accent-[#2FB7A3]"
              />
              <span className="text-sm text-neutral-700">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Especialidades requeridas <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map(s => {
            const on = specialties.includes(s)
            return (
              <button key={s} type="button" onClick={() => toggle(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  on ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]'
                     : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#2FB7A3]/50'
                }`}>
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button"
          onClick={e => submit(e, true)}
          disabled={!!saving}
          className="flex items-center gap-2 rounded-full bg-[#2FB7A3] px-6 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3] disabled:opacity-60">
          {saving === 'publish' && <Loader2 className="size-4 animate-spin" />}
          {mode === 'edit' ? 'Guardar cambios' : 'Publicar vacante'}
        </button>

        {mode === 'create' && (
          <button type="button"
            onClick={e => submit(e, false)}
            disabled={!!saving}
            className="flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-60">
            {saving === 'draft' && <Loader2 className="size-4 animate-spin" />}
            Guardar borrador
          </button>
        )}
      </div>

    </form>
  )
}
