'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all duration-200'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
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
      <h1 className="text-[1.8rem] font-semibold tracking-tight text-white">
        Bienvenido
      </h1>
      <p className="mt-2 text-[0.96rem] text-white/50">
        Inicia sesión para continuar
      </p>

      {error && (
        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/8 px-3.5 py-2.5">
          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-7 flex flex-col gap-4">
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Contraseña
            </label>
            <Link href="/reset-password" className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors">
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
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-white/25 hover:text-white/55 transition-colors duration-150 outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-700 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-purple-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          )}
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </LoginPageShell>
  )
}
