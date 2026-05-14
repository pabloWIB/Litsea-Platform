'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, ArrowLeft, User, Mail, Lock } from 'lucide-react'
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

export default function RegisterTerapeutaClient() {
  const t = useTranslations('auth')
  const [fullName,        setFullName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [showPassword,    setShowPassword]    = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [googleLoading,   setGoogleLoading]   = useState(false)
  const [error,           setError]           = useState('')
  const [success,         setSuccess]         = useState(false)

  const supabase = createClient()

  const strength = (() => {
    if (!password) return null
    if (password.length < 6)  return { label: t('strengthTooShort'), color: '#ef4444', w: '25%' }
    if (password.length < 8)  return { label: t('strengthWeak'),     color: '#f97316', w: '50%' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
                              return { label: t('strengthFair'),     color: '#eab308', w: '75%' }
    return                           { label: t('strengthStrong'),   color: '#2FB7A3', w: '100%' }
  })()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError(t('errorTooShort')); return }
    setLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'therapist', full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      if (signUpError) {
        setError(signUpError.message.includes('already registered')
          ? t('errorEmailTaken')
          : t('errorCreateAccount'))
        return
      }
      setSuccess(true)
    } catch {
      setError(t('errorCreateAccount'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/api/auth/callback?signup_role=therapist` },
      })
    } catch {
      setError(t('errorGoogle'))
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <LoginPageShell>
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(47,183,164,0.12)', border: '1px solid rgba(47,183,164,0.25)' }}>
            <CheckCircle className="h-7 w-7 text-[#2FB7A3]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#4a4a4a]">{t('successCheckEmailTitle')}</h2>
            <p className="mt-2 text-[13.5px] text-[#8a8a8a] leading-relaxed max-w-[260px]">
              {t('successCheckEmailMessage', { email })}
            </p>
          </div>
          <p className="text-[12px] text-[#8a8a8a]">
            {t('successDidntReceive')}{' '}
            <button onClick={() => { setSuccess(false); setPassword('') }}
              className="text-[#2FB7A3] font-semibold hover:underline">
              {t('successTryAgain')}
            </button>
          </p>
          <Link href="/login/terapeuta" className="flex items-center gap-1.5 text-[13px] text-[#8a8a8a] hover:text-[#2FB7A3] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {t('successGoToSignIn')}
          </Link>
        </div>
      </LoginPageShell>
    )
  }

  return (
    <LoginPageShell>

      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2FB7A3] mb-1">{t('registerTerapeutaEyebrow')}</p>
        <h2 className="text-[26px] font-bold text-[#4a4a4a] leading-tight mb-1.5">{t('registerTerapeutaTitle')}</h2>
        <p className="text-[13.5px] text-[#8a8a8a] leading-snug">{t('registerTerapeutaSubtitle')}</p>
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
        {t('signUpWithGoogle')}
      </button>

      <div className="flex items-center gap-2.5 my-4">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
        <span className="text-[12px] text-[#d1d5db]">{t('orDivider')}</span>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      {error && <div className="mb-4"><ErrorAlert message={error} /></div>}

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">

        <div>
          <label className={labelClass}>{t('fullNameLabel')}</label>
          <div className="relative">
            <User className={iconClass} />
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              required placeholder={t('fullNamePlaceholder')} autoComplete="name"
              className={inputBase} style={inputStyle} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('emailLabel')}</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder={t('emailPlaceholder')} autoComplete="email"
              className={inputBase} style={inputStyle} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('passwordLabel')}</label>
          <div className="relative">
            <Lock className={iconClass} />
            <input type={showPassword ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} required minLength={8}
              placeholder={t('passwordMinPlaceholder')} autoComplete="new-password"
              className={`${inputBase} pr-10`} style={inputStyle} />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: '#c0c0c0' }}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {strength && (
            <div className="mt-1.5 space-y-1">
              <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: strength.w, background: strength.color }} />
              </div>
              <p className="text-[11px]" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || googleLoading}
          className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 ring-offset-white transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] focus-visible:ring-2 focus-visible:ring-[#2FB7A3] disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0">
          {loading && <Spinner />}
          {loading ? t('creatingAccount') : t('createTerapeutaAccount')}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-1.5 text-center">
        <p className="text-[13px] text-[#8a8a8a]">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login/terapeuta" className="text-[#2FB7A3] font-semibold hover:underline">{t('signInLink')}</Link>
        </p>
        <p className="text-[13px] text-[#8a8a8a]">
          {t('registerTerapeutaSwitchText')}{' '}
          <Link href="/registro-empleador" className="text-[#2FB7A3] font-semibold hover:underline">{t('registerTerapeutaSwitchCta')}</Link>
        </p>
      </div>

    </LoginPageShell>
  )
}
