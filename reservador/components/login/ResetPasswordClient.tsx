'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, Loader2, MailCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const inputBase =
  'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 bg-white/50 text-neutral-900 placeholder:text-neutral-500'
const inputIdle  = 'border-neutral-400/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white/70'
const inputError = 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/15'

export default function ResetPasswordClient() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [sent,    setSent]    = useState(false)
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

  return (
    <LoginPageShell>
      {sent ? (
        /* ── Success state ── */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
            <MailCheck className="size-7 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Revisa tu correo</h1>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-xs">
              Enviamos un enlace a{' '}
              <span className="font-semibold text-neutral-900">{email}</span>{' '}
              para restablecer tu contraseña.
            </p>
          </div>
          <p className="text-xs text-neutral-500">
            ¿No lo recibiste?{' '}
            <button
              onClick={() => setSent(false)}
              className="text-orange-600 font-medium hover:text-orange-800 transition-colors"
            >
              Intentar de nuevo
            </button>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors mt-1"
          >
            <ArrowLeft className="size-3.5" /> Volver al inicio de sesión
          </Link>
        </motion.div>
      ) : (
        /* ── Form state ── */
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Recuperar contraseña
            </h1>
            <p className="mt-1.5 text-sm text-neutral-600">
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-50/80 px-4 py-3"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
              <p className="text-xs text-red-600 leading-relaxed">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-neutral-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                autoComplete="email"
                className={`${inputBase} ${error ? inputError : inputIdle}`}
              />
            </div>

            <div className="mt-2 w-full">
              <HoverBorderGradient
                as="button"
                type="submit"
                disabled={loading}
                containerClassName="border-orange-400 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                className="bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="size-4 animate-spin" /> Enviando…</>
                ) : (
                  'Enviar enlace'
                )}
              </HoverBorderGradient>
            </div>
          </form>

          <p className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Volver al inicio de sesión
            </Link>
          </p>
        </>
      )}
    </LoginPageShell>
  )
}
