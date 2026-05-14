'use client'

import { useState, useEffect } from 'react'
import { useRouter, Link } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, ArrowLeft, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { LoginPageShell } from './LoginPageShell'

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

export default function ResetPasswordConfirmClient() {
  const t = useTranslations('resetPassword')
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
    const hash         = window.location.hash.substring(1)
    const hashParams   = new URLSearchParams(hash)
    const accessToken  = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type         = hashParams.get('type')

    if (accessToken && type === 'recovery') {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' })
        .then(({ error: e }) => { if (e) setError(t('errorLinkExpired')) })
      return
    }
    if (searchParams.get('error') === 'link_expired') setError(t('errorLinkExpired'))
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8)         { setError(t('errorTooShort')); return }
    if (password !== passwordConfirm) { setError(t('errorMismatch')); return }
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) { setError(updateError.message); return }
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errorGenericUpdate'))
    } finally {
      setLoading(false)
    }
  }

  const strength = (() => {
    if (!password) return null
    if (password.length < 6)  return { label: t('strengthTooShort'), color: '#ef4444', bg: '#fee2e2', w: '25%' }
    if (password.length < 8)  return { label: t('strengthWeak'),     color: '#f97316', bg: '#ffedd5', w: '50%' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
                              return { label: t('strengthFair'),     color: '#eab308', bg: '#fef9c3', w: '75%' }
    return                           { label: t('strengthStrong'),   color: '#2FB7A3', bg: '#ccfbf1', w: '100%' }
  })()

  const isLinkError = !done && !!error && !password && !passwordConfirm

  /* ── Done ─────────────────────────────────────────────────────────── */
  if (done) {
    return (
      <LoginPageShell>
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(47,183,164,0.12)', border: '1px solid rgba(47,183,164,0.25)' }}>
            <CheckCircle className="h-7 w-7 text-[#2FB7A3]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#4a4a4a]">{t('successTitle')}</h2>
            <p className="mt-2 text-[13.5px] text-[#8a8a8a]">{t('successMessage')}</p>
          </div>
          <Link href="/login"
            className="flex items-center gap-1.5 text-[13px] text-[#8a8a8a] hover:text-[#2FB7A3] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> {t('goToSignIn')}
          </Link>
        </div>
      </LoginPageShell>
    )
  }

  /* ── Invalid link ─────────────────────────────────────────────────── */
  if (isLinkError) {
    return (
      <LoginPageShell>
        <div className="mb-6">
          <h2 className="text-[26px] font-bold text-[#4a4a4a] leading-tight mb-4">
            {t('invalidLinkTitle')}
          </h2>
          <ErrorAlert message={error} />
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <Link href="/reset-password"
            className="w-full flex items-center justify-center text-[14px] font-semibold text-white transition-all duration-150"
            style={{ padding: 12, background: '#2FB7A3', borderRadius: 10 }}>
            {t('requestNewLink')}
          </Link>
          <Link href="/login"
            className="flex items-center justify-center gap-1.5 text-[13px] text-[#8a8a8a] hover:text-[#2FB7A3] transition-colors mt-1">
            <ArrowLeft className="h-3.5 w-3.5" /> {t('backToSignIn')}
          </Link>
        </div>
      </LoginPageShell>
    )
  }

  /* ── Form ─────────────────────────────────────────────────────────── */
  return (
    <LoginPageShell>
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2FB7A3] mb-1">
          Seguridad
        </p>
        <h2 className="text-[26px] font-bold text-[#4a4a4a] leading-tight mb-1.5">
          {t('confirmTitle')}
        </h2>
        <p className="text-[13.5px] text-[#8a8a8a] leading-snug">
          {t('confirmSubtitle')}
        </p>
      </div>

      {error && <div className="mb-4"><ErrorAlert message={error} /></div>}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">

        {/* New password */}
        <div>
          <label htmlFor="password" className={labelClass}>{t('newPasswordLabel')}</label>
          <div className="relative">
            <Lock className={iconClass} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={8}
              placeholder={t('newPasswordPlaceholder')} autoComplete="new-password"
              className={`${inputBase} pr-10`} style={inputStyle}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
              style={{ color: '#c0c0c0' }}>
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

        {/* Confirm password */}
        <div>
          <label htmlFor="passwordConfirm" className={labelClass}>{t('confirmPasswordLabel')}</label>
          <div className="relative">
            <Lock className={iconClass} />
            <input
              id="passwordConfirm"
              type={showConfirm ? 'text' : 'password'}
              value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
              required
              placeholder={t('confirmPasswordPlaceholder')} autoComplete="new-password"
              className={`${inputBase} pr-10`}
              style={{
                ...inputStyle,
                borderColor: passwordConfirm && password !== passwordConfirm ? '#fca5a5' : '#e5e7eb',
              }}
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
              style={{ color: '#c0c0c0' }}>
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordConfirm && password !== passwordConfirm && (
            <p className="mt-1 text-[12px] text-[#b91c1c]">{t('passwordsNoMatch')}</p>
          )}
        </div>

        <button type="submit" disabled={loading || !password || !passwordConfirm}
          className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 ring-offset-white transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] focus-visible:ring-2 focus-visible:ring-[#2FB7A3] disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0">
          {loading && <Spinner />}
          {loading ? t('saving') : t('savePassword')}
        </button>
      </form>

      <div className="flex items-center gap-2.5 my-5">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      <Link href="/login"
        className="flex items-center justify-center gap-1.5 text-[13px] text-[#8a8a8a] hover:text-[#2FB7A3] transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> {t('backToSignIn')}
      </Link>
    </LoginPageShell>
  )
}
