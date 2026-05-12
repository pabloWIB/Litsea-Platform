'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const EASE = [0.22, 1, 0.36, 1] as const
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay },
})

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/6 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:ring-2 focus:ring-[#2FB7A3]/40 focus:border-[#2FB7A3]/50 transition-all duration-200'

export default function ResetPasswordClient() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password/confirm`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (resetError) { setError(resetError.message); return }
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <LoginPageShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-[#2FB7A3]/15 border border-[#2FB7A3]/25 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-[#2FB7A3]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Revisa tu correo</h1>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Enviamos un enlace a <strong className="text-white/80">{email}</strong> para restablecer tu contraseña.
            </p>
          </div>
          <p className="text-[11px] text-white/25">
            ¿No lo recibiste?{' '}
            <button onClick={() => setSent(false)}
              className="text-[#2FB7A3] hover:text-[#3ecfbb] underline underline-offset-2 transition-colors">
              Intentar de nuevo
            </button>
          </p>
          <Link href="/login" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio de sesión
          </Link>
        </motion.div>
      </LoginPageShell>
    )
  }

  return (
    <LoginPageShell>
      <motion.div {...fadeUp(0.45)}>
        <h1 className="text-[1.7rem] font-semibold tracking-tight text-white leading-tight">
          Recuperar contraseña
        </h1>
        <p className="mt-1.5 text-[0.88rem] text-white/45 leading-relaxed">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleReset} className="mt-7 flex flex-col gap-4">
        <motion.div {...fadeUp(0.55)} className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Correo electrónico
          </label>
          <input
            id="email" type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            required placeholder="tu@correo.com" autoComplete="email"
            className={inputClass}
          />
        </motion.div>

        <motion.div {...fadeUp(0.65)}>
          <HoverBorderGradient
            as="button" type="submit"
            disabled={loading}
            containerClassName="w-full cursor-pointer mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            backdropClassName="bg-[#2FB7A3]"
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white"
          >
            {loading && (
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            )}
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </HoverBorderGradient>
        </motion.div>
      </form>

      <motion.div {...fadeUp(0.75)} className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio de sesión
        </Link>
      </motion.div>
    </LoginPageShell>
  )
}
