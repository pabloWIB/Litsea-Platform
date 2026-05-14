'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Loader2, CheckCircle2 } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

type Opinion = {
  id: string
  nombre: string
  cargo: string | null
  empresa: string | null
  contenido: string
  rating: number
  created_at: string
}

// ─── Star rating input ────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-colors"
        >
          <span className={(hovered || value) >= i ? 'text-[#2FB7A3]' : 'text-neutral-200'}>★</span>
        </button>
      ))}
    </div>
  )
}

// ─── Opinion card ─────────────────────────────────────────────────────────────

function OpinionCard({ opinion }: { opinion: Opinion }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col gap-3">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < opinion.rating ? 'text-[#2FB7A3]' : 'text-neutral-200'}>★</span>
        ))}
      </div>
      <p className="text-neutral-700 text-sm leading-relaxed flex-1">
        &ldquo;{opinion.contenido}&rdquo;
      </p>
      <div>
        <p className="font-semibold text-neutral-900 text-sm">{opinion.nombre}</p>
        {(opinion.cargo || opinion.empresa) && (
          <p className="text-neutral-400 text-xs mt-0.5">
            {[opinion.cargo, opinion.empresa].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalState = 'idle' | 'submitting' | 'success' | 'error'

function OpinionModal({ onClose }: { onClose: () => void }) {
  const [nombre,    setNombre]    = useState('')
  const [email,     setEmail]     = useState('')
  const [cargo,     setCargo]     = useState('')
  const [empresa,   setEmpresa]   = useState('')
  const [contenido, setContenido] = useState('')
  const [rating,    setRating]    = useState(0)
  const [state,     setState]     = useState<ModalState>('idle')
  const [errorMsg,  setErrorMsg]  = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!rating) { setErrorMsg('Selecciona una calificación.'); return }
    setState('submitting')
    setErrorMsg('')

    const res = await fetch('/api/opiniones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, cargo, empresa, contenido, rating }),
    })

    if (res.ok) {
      setState('success')
    } else {
      setErrorMsg(await res.text())
      setState('error')
    }
  }

  const inputClass = 'w-full rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]/30 focus:border-[#2FB7A3] transition'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors">
          <X className="size-5" />
        </button>

        {state === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 className="size-12 text-[#2FB7A3] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-2">¡Gracias por compartir!</h3>
            <p className="text-sm text-neutral-500 mb-6">Tu opinión será revisada por el equipo Litsea.</p>
            <button onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#239688] transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Comparte tu experiencia</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input required value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre completo *" className={inputClass} />
              </div>
              <div className="col-span-2">
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email *" className={inputClass} />
                <p className="text-[11px] text-neutral-400 mt-1">Tu email no se mostrará públicamente.</p>
              </div>
              <input value={cargo} onChange={e => setCargo(e.target.value)}
                placeholder="Cargo (opcional)" className={inputClass} />
              <input value={empresa} onChange={e => setEmpresa(e.target.value)}
                placeholder="Hotel / Empresa (opcional)" className={inputClass} />
            </div>

            <div>
              <textarea required value={contenido} onChange={e => setContenido(e.target.value)}
                rows={3} maxLength={300} placeholder="Cuéntanos cómo fue tu experiencia con Litsea... *"
                className={`${inputClass} resize-none`} />
              <p className="text-[11px] text-neutral-400 mt-1 text-right">{contenido.length}/300</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-700 mb-2">Calificación *</p>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {(state === 'error' || errorMsg) && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMsg}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 rounded-full border border-neutral-200 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={state === 'submitting'}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#2FB7A3] py-2.5 text-sm font-semibold text-white hover:bg-[#239688] disabled:opacity-60 transition-colors">
                {state === 'submitting' && <Loader2 className="size-4 animate-spin" />}
                {state === 'submitting' ? 'Enviando...' : 'Enviar opinión'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function OpinionesSection() {
  const [opiniones, setOpiniones] = useState<Opinion[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/api/opiniones')
      .then(r => r.json())
      .then(setOpiniones)
      .catch(() => {})
  }, [])

  if (opiniones.length === 0) return null

  return (
    <section className="bg-[#FDFAF5] py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 md:mb-16 flex items-end justify-between"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
              Comunidad
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-[0.95]">
              Lo que dicen<br />
              <span className="text-[#2FB7A3]">de nosotros.</span>
            </h2>
            <p className="text-neutral-500 text-sm mt-4">Terapeutas y empleadores que confían en Litsea.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="hidden md:inline-flex items-center text-sm text-neutral-500 hover:text-[#2FB7A3] transition-colors font-medium"
          >
            Comparte tu experiencia →
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {opiniones.slice(0, 6).map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
            >
              <OpinionCard opinion={op} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-[#2FB7A3] hover:text-white hover:border-[#2FB7A3] transition-all duration-200"
          >
            Comparte tu experiencia →
          </button>
        </motion.div>

      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <OpinionModal onClose={() => setShowModal(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
