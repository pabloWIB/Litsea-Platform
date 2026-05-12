'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const inputBase =
  'w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 bg-white/50 text-neutral-900 placeholder:text-neutral-500'
const inputIdle  = 'border-neutral-400/40 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:bg-white/70'
const inputError = 'border-red-400/60 focus:border-red-400 focus:ring-2 focus:ring-red-400/15'

export default function LoginClient() {
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/dashboard')
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) { setError('Correo o contraseña incorrectos.'); return }
      if (data?.user) router.push('/dashboard')
    } catch {
      setError('Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginPageShell>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Bienvenido de nuevo
        </h1>
        <p className="mt-1.5 text-sm text-neutral-700">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Error */}
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

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">

        {/* Email */}
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

        {/* Password */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-neutral-700">
              Contraseña
            </label>
            <Link href="/reset-password" className="text-[11px] text-orange-700 hover:text-orange-900 transition-colors font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className={`${inputBase} ${error ? inputError : inputIdle} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-neutral-500 hover:text-neutral-800 transition-colors outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Submit — HoverBorderGradient */}
        <div className="mt-2 w-full">
          <HoverBorderGradient
            as="button"
            type="submit"
            disabled={loading}
            containerClassName="border-orange-400 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
            className="bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Ingresando…
              </>
            ) : (
              'Ingresar'
            )}
          </HoverBorderGradient>
        </div>
      </form>

      {/* Back */}
      <p className="mt-8 text-center text-[11px] text-neutral-600">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          ← Volver al sitio
        </Link>
      </p>

    </LoginPageShell>
  )
}
