'use client'

import { useState } from 'react'
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

export default function RegisterEmpleadorClient() {
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (password !== passwordConfirm) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'employer', full_name: fullName, company_name: company },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (signUpError) {
        setError(signUpError.message.includes('already registered')
          ? 'Este correo ya tiene una cuenta. Inicia sesión.'
          : signUpError.message)
        return
      }
      setSuccess(true)
    } catch {
      setError('Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?signup_role=employer` },
      })
    } catch {
      setError('Error al conectar con Google.')
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <LoginPageShell
        image="/ilustracion-bienestar-aprobacion-documentos-ui.png"
        imageAlt="Empleador verificado en Litsea Empleos"
      >
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
            <h1 className="text-2xl font-semibold tracking-tight text-white">¡Revisa tu correo!</h1>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Enviamos un enlace de confirmación a{' '}
              <strong className="text-white/80">{email}</strong>.
            </p>
          </div>
          <p className="text-[11px] text-white/25">
            ¿No lo recibiste?{' '}
            <button onClick={() => { setSuccess(false); setPassword(''); setPasswordConfirm('') }}
              className="text-[#2FB7A3] hover:text-[#3ecfbb] underline underline-offset-2 transition-colors">
              Intentar de nuevo
            </button>
          </p>
          <Link href="/login" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Ir al inicio de sesión
          </Link>
        </motion.div>
      </LoginPageShell>
    )
  }

  return (
    <LoginPageShell
      image="/ilustracion-bienestar-aprobacion-documentos-ui.png"
      imageAlt="Empleador verificado en Litsea Empleos"
    >
      <motion.div {...fadeUp(0.45)}>
        <h1 className="text-[1.7rem] font-semibold tracking-tight text-white leading-tight">
          Soy empleador
        </h1>
        <p className="mt-1.5 text-[0.88rem] text-white/45">
          Publica vacantes y encuentra terapeutas certificados
        </p>
      </motion.div>

      {/* Google */}
      <motion.div {...fadeUp(0.55)} className="mt-6">
        <HoverBorderGradient
          as="button"
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading || loading}
          containerClassName="w-full cursor-pointer border-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
          backdropClassName="bg-white/6"
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white"
        >
          {googleLoading ? (
            <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Registrarse con Google
        </HoverBorderGradient>
      </motion.div>

      <motion.div {...fadeUp(0.62)} className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[11px] text-white/25">o con correo</span>
        <div className="h-px flex-1 bg-white/8" />
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
        <motion.div {...fadeUp(0.67)} className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Nombre</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              placeholder="Juan Pérez" autoComplete="name" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Hotel / Spa</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} required
              placeholder="Grand Hyatt" autoComplete="organization" className={inputClass} />
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.72)} className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Correo electrónico</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            placeholder="contacto@hotel.com" autoComplete="email" className={inputClass} />
        </motion.div>

        <motion.div {...fadeUp(0.77)} className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Contraseña</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              required minLength={8} placeholder="Mínimo 8 caracteres" autoComplete="new-password"
              className={`${inputClass} pr-10`} />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.82)} className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Confirmar contraseña</label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)} required placeholder="••••••••"
              autoComplete="new-password"
              className={`${inputClass} pr-10 ${passwordConfirm && password !== passwordConfirm ? 'border-red-500/40' : ''}`} />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordConfirm && password !== passwordConfirm && (
            <p className="text-[10px] text-red-400">Las contraseñas no coinciden.</p>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.88)}>
          <HoverBorderGradient
            as="button"
            type="submit"
            disabled={loading || googleLoading}
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta de empleador'}
          </HoverBorderGradient>
        </motion.div>
      </form>

      <motion.div {...fadeUp(0.94)} className="mt-6 flex flex-col gap-2 text-center">
        <p className="text-[12px] text-white/30">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors font-medium">Inicia sesión</Link>
        </p>
        <p className="text-[12px] text-white/30">
          ¿Eres terapeuta?{' '}
          <Link href="/registro-terapeuta" className="text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors font-medium">Regístrate aquí</Link>
        </p>
      </motion.div>
    </LoginPageShell>
  )
}
