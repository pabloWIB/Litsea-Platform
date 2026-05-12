'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const inputBase =
  'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 bg-white/50 text-neutral-900 placeholder:text-neutral-500'
const inputIdle  = 'border-neutral-400/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white/70'
const inputError = 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/15'

export default function ResetPasswordConfirmClient() {
  const [password,        setPassword]        = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword,    setShowPassword]    = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [done,            setDone]            = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    const accessToken  = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type         = hashParams.get('type')

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
    if (password.length < 8)          { setError('La contraseña debe tener al menos 8 caracteres.'); return }
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
    if (password.length < 6)                                              return { label: 'Muy corta', color: 'bg-red-400',    width: 'w-1/4' }
    if (password.length < 8)                                              return { label: 'Débil',     color: 'bg-orange-400', width: 'w-2/4' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))              return { label: 'Regular',   color: 'bg-yellow-400', width: 'w-3/4' }
    return                                                                       { label: 'Fuerte',    color: 'bg-green-500',  width: 'w-full' }
  })()

  const isLinkError = !done && !!error && password === '' && passwordConfirm === ''

  return (
    <LoginPageShell>

      {/* ── Success ── */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
            <CheckCircle className="size-7 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">¡Contraseña actualizada!</h1>
            <p className="mt-2 text-sm text-neutral-600">Redirigiendo al inicio de sesión…</p>
          </div>
          <Link href="/login" className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors">
            <ArrowLeft className="size-3.5" /> Ir al inicio de sesión
          </Link>
        </motion.div>
      )}

      {/* ── Invalid link ── */}
      {isLinkError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-5"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Enlace inválido</h1>
            <p className="mt-1.5 text-sm text-neutral-600">Este enlace expiró o ya fue utilizado.</p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-50/80 px-4 py-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
            <p className="text-xs text-red-600 leading-relaxed">{error}</p>
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <HoverBorderGradient
              as="a"
              href="/reset-password"
              containerClassName="border-orange-400 cursor-pointer w-full"
              className="bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 w-full flex items-center justify-center"
            >
              Solicitar nuevo enlace
            </HoverBorderGradient>
            <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors mt-1">
              <ArrowLeft className="size-3.5" /> Volver al inicio de sesión
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Form ── */}
      {!done && !isLinkError && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Nueva contraseña</h1>
            <p className="mt-1.5 text-sm text-neutral-600">Elige una contraseña segura para tu cuenta.</p>
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

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">

            {/* New password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-neutral-700">
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
                  className={`${inputBase} ${inputIdle} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-neutral-500 hover:text-neutral-800 transition-colors outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {strength && (
                <div className="space-y-1 mt-0.5">
                  <div className="h-1 w-full rounded-full bg-neutral-200 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-[10px] text-neutral-500">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="passwordConfirm" className="text-[11px] font-semibold uppercase tracking-widest text-neutral-700">
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
                  className={`${inputBase} ${passwordConfirm && password !== passwordConfirm ? inputError : inputIdle} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-neutral-500 hover:text-neutral-800 transition-colors outline-none"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-[10px] text-red-500">Las contraseñas no coinciden.</p>
              )}
            </div>

            <div className="mt-2 w-full">
              <HoverBorderGradient
                as="button"
                type="submit"
                disabled={loading || !password || !passwordConfirm}
                containerClassName="border-orange-400 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
                className="bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="size-4 animate-spin" /> Guardando…</>
                ) : (
                  'Guardar contraseña'
                )}
              </HoverBorderGradient>
            </div>
          </form>

          <p className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-800 transition-colors">
              <ArrowLeft className="size-3.5" /> Volver al inicio de sesión
            </Link>
          </p>
        </>
      )}

    </LoginPageShell>
  )
}
