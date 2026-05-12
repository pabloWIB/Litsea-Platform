'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all duration-200'

export default function ResetPasswordClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
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
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Revisa tu correo</h1>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Enviamos un enlace a <strong className="text-white/80">{email}</strong> para restablecer tu contraseña.
            </p>
          </div>
          <p className="text-xs text-white/30">
            ¿No lo recibiste?{' '}
            <button onClick={() => setSent(false)} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">
              Intentar de nuevo
            </button>
          </p>
          <Link href="/login" className="mt-1 flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio de sesión
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Recuperar contraseña</h1>
          <p className="mt-1.5 text-sm text-white/50">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
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
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              )}
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className="mt-6 text-center">
            <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio de sesión
            </Link>
          </p>
        </>
      )}
    </LoginPageShell>
  )
}
