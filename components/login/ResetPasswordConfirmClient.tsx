'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all duration-200'

export default function ResetPasswordConfirmClient() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    if (accessToken && type === 'recovery') {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' })
        .then(({ error: sessionError }) => {
          if (sessionError) setError('El enlace ha expirado. Solicita uno nuevo.')
        })
      return
    }

    if (searchParams.get('error') === 'link_expired') {
      setError('El enlace ha expirado. Solicita uno nuevo.')
    }
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (password !== passwordConfirm) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) { setError(updateError.message); return }
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    if (!password) return null
    if (password.length < 6) return { label: 'Muy corta', color: 'bg-red-500', width: 'w-1/4' }
    if (password.length < 8) return { label: 'Débil', color: 'bg-orange-400', width: 'w-2/4' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Regular', color: 'bg-yellow-400', width: 'w-3/4' }
    return { label: 'Fuerte', color: 'bg-green-500', width: 'w-full' }
  })()

  const isLinkError = !done && error && password === '' && passwordConfirm === ''

  return (
    <LoginPageShell>
      {done && (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/20 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">¡Contraseña actualizada!</h1>
            <p className="mt-2 text-sm text-white/50">Redirigiendo al inicio de sesión...</p>
          </div>
          <Link href="/login" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Ir al inicio de sesión
          </Link>
        </div>
      )}

      {isLinkError && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Enlace inválido</h1>
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-red-400 leading-relaxed">{error}</p>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <Link href="/reset-password" className="flex w-full items-center justify-center rounded-lg bg-purple-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-600 transition-all">
              Solicitar nuevo enlace
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mt-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio de sesión
            </Link>
          </div>
        </>
      )}

      {!done && !isLinkError && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Nueva contraseña</h1>
          <p className="mt-1.5 text-sm text-white/50">Ingresa tu nueva contraseña.</p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleUpdate} className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength && (
                <div className="space-y-1">
                  <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-[10px] text-white/30">{strength.label}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="passwordConfirm" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`${inputClass} pr-10 ${passwordConfirm && password !== passwordConfirm ? 'border-red-500/40' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-[10px] text-red-400">Las contraseñas no coinciden.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password || !passwordConfirm}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-700 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-purple-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              )}
              {loading ? 'Guardando...' : 'Guardar contraseña'}
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
