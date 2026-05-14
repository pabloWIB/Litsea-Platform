'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { LoginPageShell } from './LoginPageShell'

const inputBase =
  'w-full rounded-lg bg-[#f9fafb] text-[13.5px] text-[#4a4a4a] placeholder:text-[#c0c0c0] outline-none transition-all duration-200 focus:bg-white focus:border-[#2FB7A3] focus:ring-2 focus:ring-[#2FB7A3]/15'
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

export default function ResetPasswordClient() {
  const t = useTranslations('resetPassword')
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [sent,    setSent]    = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const redirectTo = `${window.location.origin}/api/auth/callback?next=/reset-password/confirm`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (resetError) { setError(resetError.message); return }
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  /* ── Sent ─────────────────────────────────────────────────────────── */
  if (sent) {
    return (
      <LoginPageShell>
        <div className="flex flex-col items-center text-center gap-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(47,183,164,0.12)', border: '1px solid rgba(47,183,164,0.25)' }}>
            <CheckCircle className="h-7 w-7 text-[#2FB7A3]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#4a4a4a]">{t('checkEmailTitle')}</h2>
            <p className="mt-2 text-[13.5px] text-[#8a8a8a] leading-relaxed max-w-[280px]">
              {t.rich('checkEmailMessage', {
                b: (chunks) => <strong className="text-[#4a4a4a]">{chunks}</strong>,
                email,
              })}
            </p>
          </div>
          <p className="text-[12px] text-[#8a8a8a]">
            {t('didntReceive')}{' '}
            <button onClick={() => setSent(false)}
              className="text-[#2FB7A3] font-semibold hover:underline transition-colors">
              {t('tryAgain')}
            </button>
          </p>
          <Link href="/login"
            className="flex items-center gap-1.5 text-[13px] text-[#8a8a8a] hover:text-[#2FB7A3] transition-colors">
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
          Cuenta
        </p>
        <h2 className="text-[26px] font-bold text-[#4a4a4a] leading-tight mb-1.5">
          {t('title')}
        </h2>
        <p className="text-[13.5px] text-[#8a8a8a] leading-snug">
          {t('subtitle')}
        </p>
      </div>

      {error && <div className="mb-4"><ErrorAlert message={error} /></div>}

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>{t('emailLabel')}</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              id="email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required placeholder={t('emailPlaceholder')} autoComplete="email"
              className={inputBase} style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 ring-offset-white transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] focus-visible:ring-2 focus-visible:ring-[#2FB7A3] disabled:opacity-50 disabled:cursor-not-allowed disabled:ring-0">
          {loading && <Spinner />}
          {loading ? t('sending') : t('sendLink')}
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
