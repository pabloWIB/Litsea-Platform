'use client'

import { useState, useRef, type ChangeEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SPECIALTIES, ZONES } from '@/types/database'
import {
  Camera, CheckCircle2, Award, MapPin,
  Loader2, ArrowLeft, ArrowRight,
} from 'lucide-react'

interface Initial {
  avatar_url: string | null
  specialties: string[]
  is_litsea_grad: boolean
  zones: string[]
  bio: string
  experience_years: number
}

interface Props {
  userId: string
  tpId: string
  fullName: string
  currentSlug: string | null
  initial: Initial
}

function initials(name: string) {
  const w = name.trim().split(/\s+/)
  return w.length >= 2 ? (w[0][0] + w[w.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
}

function slugify(name: string) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const STEP_LABELS = ['', 'Información básica', 'Zonas de trabajo', 'Bio y experiencia', 'Revisión y envío']
const STEP_PERCENT = [0, 25, 50, 75, 100]

export default function PerfilWizard({ userId, tpId, fullName, currentSlug, initial }: Props) {
  const router     = useRouter()
  const supabase   = createClient()
  const fileRef    = useRef<HTMLInputElement>(null)

  const [step,           setStep]           = useState(1)
  const [avatarSrc,      setAvatarSrc]      = useState<string | null>(initial.avatar_url)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [specialties,    setSpecialties]    = useState<string[]>(initial.specialties)
  const [isLitseaGrad,   setIsLitseaGrad]   = useState(initial.is_litsea_grad)
  const [zones,          setZones]          = useState<string[]>(initial.zones)
  const [bio,            setBio]            = useState(initial.bio)
  const [expYears,       setExpYears]       = useState(initial.experience_years)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState('')

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarSrc(URL.createObjectURL(file))
    setUploadingAvatar(true)

    try {
      const ext  = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/avatar.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadErr) throw uploadErr

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarSrc(publicUrl)
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId)
    } catch {
    } finally {
      setUploadingAvatar(false)
    }
  }

  const toggleSpec = (s: string) =>
    setSpecialties(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const toggleZone = (z: string) =>
    setZones(p => p.includes(z) ? p.filter(x => x !== z) : [...p, z])

  const run = async (fn: () => Promise<void>) => {
    setSaving(true)
    setError('')
    try {
      await fn()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const next1 = () => run(async () => {
    if (!specialties.length) { setError('Selecciona al menos una especialidad.'); return }
    await supabase.from('therapist_profiles')
      .update({ specialties, is_litsea_grad: isLitseaGrad })
      .eq('id', tpId)
    setStep(2)
  })

  const next2 = () => run(async () => {
    if (!zones.length) { setError('Selecciona al menos una zona.'); return }
    await supabase.from('therapist_profiles').update({ zones }).eq('id', tpId)
    setStep(3)
  })

  const next3 = () => run(async () => {
    await supabase.from('therapist_profiles')
      .update({ bio: bio.trim() || null, experience_years: expYears })
      .eq('id', tpId)
    setStep(4)
  })

  const saveAll = () => run(async () => {
    const updates: Record<string, unknown> = {
      specialties, zones,
      bio: bio.trim() || null,
      experience_years: expYears,
      is_litsea_grad: isLitseaGrad,
    }
    if (!currentSlug) {
      updates.slug = `${slugify(fullName)}-${Math.random().toString(36).slice(2, 6)}`
    }
    await supabase.from('therapist_profiles').update(updates).eq('id', tpId)
    router.push('/terapeuta/dashboard')
    router.refresh()
  })

  const percent = STEP_PERCENT[step]

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-neutral-700">
            Paso {step} de 4 — {STEP_LABELS[step]}
          </p>
          <span className="text-sm font-bold text-[#2FB7A3] tabular-nums">{percent}%</span>
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2FB7A3] rounded-full transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-7">

          <section>
            <h2 className="text-[15px] font-bold text-neutral-900 mb-3">Foto profesional</h2>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative size-20 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0 group"
              >
                {avatarSrc ? (
                  <Image src={avatarSrc} alt="Foto de perfil" fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="size-full bg-[#2FB7A3]/10 flex items-center justify-center text-[#2FB7A3] font-bold text-xl">
                    {initials(fullName)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadingAvatar
                    ? <Loader2 className="size-5 text-white animate-spin" />
                    : <Camera className="size-5 text-white" />}
                </div>
              </button>

              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-sm font-semibold text-[#2FB7A3] hover:underline"
                >
                  {avatarSrc ? 'Cambiar foto' : 'Subir foto'}
                </button>
                <p className="text-xs text-neutral-400 mt-0.5">JPG, PNG o WebP · Máx. 5 MB</p>
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </section>

          <section>
            <h2 className="text-[15px] font-bold text-neutral-900 mb-0.5">
              Especialidades <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-neutral-400 mb-3">Selecciona las técnicas que dominas.</p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(s => {
                const on = specialties.includes(s)
                return (
                  <button key={s} type="button" onClick={() => toggleSpec(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      on
                        ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#2FB7A3]/50'
                    }`}>
                    {s}
                  </button>
                )
              })}
            </div>
          </section>
          <section>
            <button
              type="button"
              onClick={() => setIsLitseaGrad(v => !v)}
              className="flex items-start gap-3 text-left group w-full"
            >
              <div className={`mt-0.5 size-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                isLitseaGrad
                  ? 'bg-[#2FB7A3] border-[#2FB7A3]'
                  : 'border-neutral-300 group-hover:border-[#2FB7A3]'
              }`}>
                {isLitseaGrad && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
                  <Award className="size-4 text-[#2FB7A3]" />
                  Egresado de Litsea Centro de Capacitación
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  El equipo Litsea validará tus certificados y habilitará el badge en tu perfil.
                </p>
              </div>
            </button>
          </section>

        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-[15px] font-bold text-neutral-900 mb-0.5">
              Zonas de trabajo <span className="text-red-500">*</span>
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Selecciona las zonas de la Riviera Maya donde puedes trabajar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ZONES.map(z => {
              const on = zones.includes(z)
              return (
                <button key={z} type="button" onClick={() => toggleZone(z)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    on
                      ? 'bg-[#2FB7A3] text-white border-[#2FB7A3]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#2FB7A3]/50'
                  }`}>
                  <MapPin className="size-3.5 shrink-0" />
                  {z}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">

          <section>
            <label className="block text-[15px] font-bold text-neutral-900 mb-0.5">
              Biografía profesional
            </label>
            <p className="text-xs text-neutral-400 mb-2">
              Describe tu experiencia, técnicas dominadas y lo que te hace destacar.
            </p>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={500}
              rows={6}
              placeholder="Terapeuta certificada con 5 años de experiencia en hoteles de lujo. Me especializo en masoterapia sueca y aromaterapia..."
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent resize-none"
            />
            <p className="text-xs text-neutral-400 text-right mt-1 tabular-nums">
              {bio.length}/500
            </p>
          </section>

          <section>
            <label className="block text-[15px] font-bold text-neutral-900 mb-1">
              Años de experiencia
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={expYears}
              onChange={e => setExpYears(Math.max(0, Math.min(50, Number(e.target.value))))}
              className="w-28 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent"
            />
          </section>

        </div>
      )}

      {step === 4 && (
        <div className="space-y-5">
          <p className="text-sm text-neutral-500">
            Revisa tu información antes de guardar. Podrás editarla en cualquier momento.
          </p>

          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-5 space-y-4">

            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0">
                {avatarSrc ? (
                  <Image src={avatarSrc} alt="Avatar" fill sizes="64px" className="object-cover" />
                ) : (
                  <div className="size-full bg-[#2FB7A3]/10 flex items-center justify-center text-[#2FB7A3] font-bold text-lg">
                    {initials(fullName)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-neutral-900">{fullName}</p>
                {isLitseaGrad && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2FB7A3] mt-0.5">
                    <Award className="size-3.5" /> Egresado Litsea
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1.5">Especialidades</p>
              <div className="flex flex-wrap gap-1.5">
                {specialties.length ? specialties.map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-neutral-200 text-neutral-700">
                    {s}
                  </span>
                )) : <span className="text-xs text-neutral-400">Sin seleccionar</span>}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1">Zonas</p>
              <div className="flex flex-wrap gap-1.5">
                {zones.length ? zones.map(z => (
                  <span key={z} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-neutral-200 text-neutral-700">
                    <MapPin className="size-3 text-neutral-400" /> {z}
                  </span>
                )) : <span className="text-xs text-neutral-400">Sin seleccionar</span>}
              </div>
            </div>

            {bio.trim() && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1">Biografía</p>
                <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3">{bio}</p>
              </div>
            )}

            {expYears > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-1">Experiencia</p>
                <p className="text-sm text-neutral-700">
                  {expYears} {expYears === 1 ? 'año' : 'años'}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 bg-[#2FB7A3]/8 border border-[#2FB7A3]/20 rounded-xl px-4 py-3">
            <CheckCircle2 className="size-4 text-[#2FB7A3] shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-700 leading-relaxed">
              Tu perfil quedará como <strong>pendiente de revisión</strong>. El equipo Litsea lo validará
              antes de publicarlo en el directorio de terapeutas.
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-100">
        <button
          type="button"
          onClick={() => { setError(''); setStep(s => Math.max(1, s - 1)) }}
          disabled={step === 1 || saving}
          className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={step === 1 ? next1 : step === 2 ? next2 : next3}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-[#2FB7A3] px-6 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3] disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            Continuar
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-[#2FB7A3] px-6 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3] disabled:opacity-60"
          >
            {saving
              ? <Loader2 className="size-4 animate-spin" />
              : <CheckCircle2 className="size-4" />}
            Guardar perfil
          </button>
        )}
      </div>
    </div>
  )
}
