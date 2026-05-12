'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
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

export default function ResetPasswordConfirmClient() {
  const [password, setPassword]           = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [done, setDone]                   = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  useEffect(() => {
    const hash       = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    const accessToken  = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type         = hashParams.get('type')

    if (accessToken && type === 'recovery') {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' })
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
    return { label: 'Fuerte', color: 'bg-[#2FB7A3]', width: 'w-full' }
  })()

  const isLinkError = !done && !!error && !password && !passwordConfirm

  if (done) {
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
            <h1 className="text-2xl font-semibold tracking-tight text-white">¡Contraseña actualizada!</h1>
            <p className="mt-2 text-sm text-white/50">Redirigiendo al inicio de sesión...</p>
          </div>
          <Link href="/login" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Ir ya
          </Link>
        </motion.div>
      </LoginPageShell>
    )
  }

  if (isLinkError) {
    return (
      <LoginPageShell>
        <motion.div {...fadeUp(0.45)}>
          <h1 className="text-[1.7rem] font-semibold tracking-tight text-white leading-tight">Enlace inválido</h1>
        </motion.div>
        <motion.div {...fadeUp(0.55)}
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </motion.div>
        <motion.div {...fadeUp(0.65)} className="mt-5 flex flex-col gap-2">
          <Link href="/reset-password">
            <HoverBorderGradient
              as="div"
              containerClassName="w-full cursor-pointer"
              backdropClassName="bg-[#2FB7A3]"
              className="w-full flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white"
            >
              Solicitar nuevo enlace
            </HoverBorderGradient>
          </Link>
          <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mt-1">
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
          Nueva contraseña
        </h1>
        <p className="mt-1.5 text-[0.88rem] text-white/45 leading-relaxed">
          Ingresa y confirma tu nueva contraseña.
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

      <form onSubmit={handleUpdate} className="mt-7 flex flex-col gap-4">
        <motion.div {...fadeUp(0.55)} className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required minLength={8} placeholder="Mínimo 8 caracteres" autoComplete="new-password"
              className={`${inputClass} pr-10`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none">
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
        </motion.div>

        <motion.div {...fadeUp(0.63)} className="flex flex-col gap-1.5">
          <label htmlFor="passwordConfirm" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              id="passwordConfirm"
              type={showConfirm ? 'text' : 'password'}
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              required placeholder="••••••••" autoComplete="new-password"
              className={`${inputClass} pr-10 ${passwordConfirm && password !== passwordConfirm ? 'border-red-500/40' : ''}`}
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordConfirm && password !== passwordConfirm && (
            <p className="text-[10px] text-red-400">Las contraseñas no coinciden.</p>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.72)}>
          <HoverBorderGradient
            as="button" type="submit"
            disabled={loading || !password || !passwordConfirm}
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
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </HoverBorderGradient>
        </motion.div>
      </form>

      <motion.div {...fadeUp(0.8)} className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio de sesión
        </Link>
      </motion.div>
    </LoginPageShell>
  )
}
