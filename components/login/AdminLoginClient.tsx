'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginPageShell } from './LoginPageShell'
import { useTranslations } from 'next-intl'

const inputBase =
  'w-full bg-[#f9fafb] text-[13.5px] text-[#4a4a4a] placeholder:text-[#c0c0c0] outline-none transition-all duration-200 focus:bg-white focus:border-[#2FB7A3] focus:ring-2 focus:ring-[#2FB7A3]/15'
const inputStyle = { padding: '11px 14px 11px 40px', border: '1.5px solid #e5e7eb', borderRadius: 10 }
const labelClass = 'block text-[13px] font-medium text-[#4a4a4a] mb-1.5'
const iconClass  = 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c0c0c0] pointer-events-none'

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

export default function AdminLoginClient() {
  const t = useTranslations('auth')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', data.session.user.id).single()
        if (profile?.role === 'admin') router.replace('/admin')
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
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', data.user.id).single()

        if (profile?.role !== 'admin') {
          await supabase.auth.signOut()
          setError(t('loginAdminErrorNotAdmin'))
          return
        }

        router.push('/admin')
      }
    } catch {
      setError(t('errorSignInGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginPageShell hideLocaleSwitcher>

      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2FB7A3] mb-1">
          {t('loginAdminEyebrow')}
        </p>
        <h2 className="text-[26px] font-bold text-[#4a4a4a] leading-tight mb-1.5">
          {t('loginAdminTitle')}
        </h2>
        <p className="text-[13.5px] text-[#8a8a8a] leading-snug">
          {t('loginAdminSubtitle')}
        </p>
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
          <label htmlFor="password" className={labelClass}>{t('passwordLabel')}</label>
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

        <button type="submit" disabled={loading}
          className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 ring-offset-white transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] focus-visible:ring-2 focus-visible:ring-[#2FB7A3] disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0">
          {loading && <Spinner />}
          {loading ? t('signingIn') : t('signIn')}
        </button>
      </form>

    </LoginPageShell>
  )
}
