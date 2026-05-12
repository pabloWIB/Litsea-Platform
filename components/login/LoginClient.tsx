'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
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

const VARIANTS = {
  terapeuta: {
    title:        'Bienvenido, terapeuta',
    subtitle:     'Accede a tu panel y gestiona tus aplicaciones',
    image:        '/wellness-login-ilustracion-terapeuta-certificacion-spa.png',
    imageAlt:     'Terapeuta certificada Litsea',
    registerHref: '/registro-terapeuta',
    registerText: '¿Aún no tienes cuenta?',
    registerCta:  'Crea tu perfil gratis',
    switchHref:   '/login/empleador',
    switchText:   '¿Representas un hotel o spa?',
    switchCta:    'Ingresar como empresa',
  },
  empleador: {
    title:        'Bienvenido, empresa',
    subtitle:     'Accede a tu panel y gestiona tus vacantes',
    image:        '/ilustracion-bienestar-aprobacion-documentos-ui.png',
    imageAlt:     'Panel de empleador Litsea',
    registerHref: '/registro-empleador',
    registerText: '¿Aún no tienes cuenta?',
    registerCta:  'Registra tu empresa',
    switchHref:   '/login/terapeuta',
    switchText:   '¿Eres terapeuta egresado?',
    switchCta:    'Ingresar como terapeuta',
  },
} as const

type Variant = keyof typeof VARIANTS

async function getRoleRedirect(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  if (data?.role === 'admin')    return '/admin'
  if (data?.role === 'employer') return '/empleador/dashboard'
  return '/terapeuta/dashboard'
}

export default function LoginClient({ variant = 'terapeuta' }: { variant?: Variant }) {
  const cfg = VARIANTS[variant]
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError]               = useState('')
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const dest = await getRoleRedirect(supabase, data.session.user.id)
        router.replace(dest)
      }
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError('Correo o contraseña incorrectos.'); return }
      if (data?.user) {
        const dest = await getRoleRedirect(supabase, data.user.id)
        router.push(dest)
      }
    } catch {
      setError('Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
    } catch {
      setError('Error al conectar con Google.')
      setGoogleLoading(false)
    }
  }

  return (
    <LoginPageShell image={cfg.image} imageAlt={cfg.imageAlt}>

      <motion.div {...fadeUp(0.45)}>
        <h1 className="text-[1.7rem] font-semibold tracking-tight text-white leading-tight">
          {cfg.title}
        </h1>
        <p className="mt-1.5 text-[0.88rem] text-white/45 leading-relaxed">
          {cfg.subtitle}
        </p>
      </motion.div>

      {/* Google */}
      <motion.div {...fadeUp(0.55)} className="mt-6">
        <HoverBorderGradient
          as="button"
          type="button"
          onClick={handleGoogleLogin}
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
          Continuar con Google
        </HoverBorderGradient>
      </motion.div>

      <motion.div {...fadeUp(0.62)} className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[11px] text-white/25">o con correo</span>
        <div className="h-px flex-1 bg-white/8" />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3.5 py-2.5"
        >
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <motion.div {...fadeUp(0.67)} className="flex flex-col gap-1.5">
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

        <motion.div {...fadeUp(0.74)} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Contraseña
            </label>
            <Link href="/reset-password" className="text-[11px] text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••" autoComplete="current-password"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.82)}>
          <HoverBorderGradient
            as="button" type="submit"
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
            {loading ? 'Ingresando...' : 'Ingresar'}
          </HoverBorderGradient>
        </motion.div>
      </form>

      <motion.div {...fadeUp(0.9)} className="mt-7 flex flex-col gap-2 text-center">
        <p className="text-[12px] text-white/30">
          {cfg.registerText}{' '}
          <Link href={cfg.registerHref} className="text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors font-medium">
            {cfg.registerCta}
          </Link>
        </p>
        <p className="text-[12px] text-white/30">
          {cfg.switchText}{' '}
          <Link href={cfg.switchHref} className="text-[#2FB7A3] hover:text-[#3ecfbb] transition-colors font-medium">
            {cfg.switchCta}
          </Link>
        </p>
      </motion.div>

    </LoginPageShell>
  )
}
