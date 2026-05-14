'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'
import { useTranslations } from 'next-intl'

const inputBase =
  'w-full bg-[#f9fafb] text-[13.5px] text-[#4a4a4a] placeholder:text-[#c0c0c0] outline-none transition-all duration-200 focus:bg-white focus:border-[#2FB7A3] focus:ring-2 focus:ring-[#2FB7A3]/15'
const inputStyle = { padding: '11px 14px 11px 40px', border: '1.5px solid #e5e7eb', borderRadius: 10 }
const labelClass = 'block text-[13px] font-medium text-[#4a4a4a] mb-1.5'
const iconClass  = 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c0c0c0] pointer-events-none'

type Variant = 'terapeuta' | 'empleador'

const VARIANT_HREFS: Record<Variant, { registerHref: string; switchHref: string }> = {
  terapeuta: { registerHref: '/registro-terapeuta', switchHref: '/login/empleador' },
  empleador: { registerHref: '/registro-empleador', switchHref: '/login/terapeuta' },
}

type AuthKeys = {
  eyebrow: 'loginTerapeutaEyebrow' | 'loginEmpleadorEyebrow'
  title:   'loginTerapeutaTitle'   | 'loginEmpleadorTitle'
  subtitle:'loginTerapeutaSubtitle'| 'loginEmpleadorSubtitle'
  regText: 'loginTerapeutaRegisterText' | 'loginEmpleadorRegisterText'
  regCta:  'loginTerapeutaRegisterCta'  | 'loginEmpleadorRegisterCta'
  swText:  'loginTerapeutaSwitchText'   | 'loginEmpleadorSwitchText'
  swCta:   'loginTerapeutaSwitchCta'    | 'loginEmpleadorSwitchCta'
}

const VARIANT_KEYS: Record<Variant, AuthKeys> = {
  terapeuta: {
    eyebrow: 'loginTerapeutaEyebrow',
    title:   'loginTerapeutaTitle',
    subtitle:'loginTerapeutaSubtitle',
    regText: 'loginTerapeutaRegisterText',
    regCta:  'loginTerapeutaRegisterCta',
    swText:  'loginTerapeutaSwitchText',
    swCta:   'loginTerapeutaSwitchCta',
  },
  empleador: {
    eyebrow: 'loginEmpleadorEyebrow',
    title:   'loginEmpleadorTitle',
    subtitle:'loginEmpleadorSubtitle',
    regText: 'loginEmpleadorRegisterText',
    regCta:  'loginEmpleadorRegisterCta',
    swText:  'loginEmpleadorSwitchText',
    swCta:   'loginEmpleadorSwitchCta',
  },
}

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
    </svg>
  )
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg px-3.5 py-3"
      style={{ background: '#fff2f2', border: '1px solid #fecaca' }}>
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#b91c1c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-[13px] text-[#b91c1c] leading-relaxed">{message}</p>
    </div>
  )
}

async function getRoleRedirect(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
  if (data?.role === 'admin')    return '/admin'
  if (data?.role === 'employer') return '/empleador/dashboard'
  return '/terapeuta/dashboard'
}

export default function LoginClient({ variant = 'terapeuta' }: { variant?: Variant }) {
  const hrefs = VARIANT_HREFS[variant]
  const keys  = VARIANT_KEYS[variant]
  const t = useTranslations('auth')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState('')
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
      if (authError) { setError(t('errorSignIn')); return }
      if (data?.user) {
        const dest = await getRoleRedirect(supabase, data.user.id)
        router.push(dest)
      }
    } catch {
      setError(t('errorSignInGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/api/auth/callback` },
      })
    } catch {
      setError(t('errorGoogle'))
      setGoogleLoading(false)
    }
  }

  return (
    <LoginPageShell>

      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2FB7A3] mb-1">
          {t(keys.eyebrow)}
        </p>
        <h2 className="text-[26px] font-bold text-[#4a4a4a] leading-tight mb-1.5">
          {t(keys.title)}
        </h2>
        <p className="text-[13.5px] text-[#8a8a8a] leading-snug">
          {t(keys.subtitle)}
        </p>
      </div>

      <button type="button" onClick={handleGoogle} disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-2.5 text-[13.5px] font-medium text-[#4a4a4a] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f3f4f6]"
        style={{ padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, background: '#f9fafb' }}>
        {googleLoading ? <Spinner /> : (
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {t('continueWithGoogle')}
      </button>

      <div className="flex items-center gap-2.5 my-4">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
        <span className="text-[12px] text-[#d1d5db]">{t('orDivider')}</span>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      {error && <div className="mb-4"><ErrorAlert message={error} /></div>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">

        <div>
          <label htmlFor="email" className={labelClass}>{t('emailLabel')}</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder={t('emailPlaceholder')} autoComplete="email"
              className={inputBase} style={inputStyle} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-[#4a4a4a]">{t('passwordLabel')}</label>
            <Link href="/reset-password" className="text-[12px] text-[#2FB7A3] font-medium hover:underline transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Lock className={iconClass} />
            <input id="password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} required
              placeholder={t('passwordPlaceholder')} autoComplete="current-password"
              className={`${inputBase} pr-10`} style={inputStyle} />
            <button type="button" onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: '#c0c0c0' }}
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading || googleLoading}
          className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 ring-offset-white transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] focus-visible:ring-2 focus-visible:ring-[#2FB7A3] disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0">
          {loading && <Spinner />}
          {loading ? t('signingIn') : t('signIn')}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-1.5 text-center">
        <p className="text-[13px] text-[#8a8a8a]">
          {t(keys.regText)}{' '}
          <Link href={hrefs.registerHref} className="text-[#2FB7A3] font-semibold hover:underline">
            {t(keys.regCta)}
          </Link>
        </p>
        <p className="text-[13px] text-[#8a8a8a]">
          {t(keys.swText)}{' '}
          <Link href={hrefs.switchHref} className="text-[#2FB7A3] font-semibold hover:underline">
            {t(keys.swCta)}
          </Link>
        </p>
      </div>

    </LoginPageShell>
  )
}
