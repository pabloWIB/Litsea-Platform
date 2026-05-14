'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
]

export function LoginPageShell({ children, hideLocaleSwitcher = false }: { children: React.ReactNode; hideLocaleSwitcher?: boolean }) {
  const locale   = useLocale()
  const router   = useRouter()
  const pathname = usePathname()
  const t = useTranslations('loginShell')
  const [isPending, startTransition] = useTransition()

  const switchLocale = (next: string) =>
    startTransition(() => router.replace(pathname, { locale: next }))

  return (
    <div className="flex min-h-screen bg-white" style={{ padding: 16, gap: 16 }}>

      {/* ── LEFT — form panel ────────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col bg-white overflow-y-auto"
        style={{ borderRadius: 20 }}
      >
        {/* Top row: mobile logo + locale switcher */}
        <div className="flex items-center justify-between px-8 pt-7 shrink-0">
          <div className="lg:hidden">
            <Image
              src="/logo-litsea-principal-color.png"
              alt="Litsea Empleos"
              width={130}
              height={40}
              style={{ width: 'auto', height: 34 }}
              priority
            />
          </div>
          <div className="hidden lg:block" />

          {/* Locale pill */}
          {!hideLocaleSwitcher && (
            <div
              className="flex items-center gap-0.5 p-0.5"
              style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10 }}
            >
              {LOCALES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => switchLocale(lang.code)}
                  disabled={isPending}
                  className="px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-150 cursor-pointer disabled:opacity-40"
                  style={{
                    borderRadius: 8,
                    background: locale === lang.code ? '#2FB7A3' : 'transparent',
                    color:      locale === lang.code ? '#ffffff'  : '#8a8a8a',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-6 py-8">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex flex-col items-center gap-3 px-6 pb-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-[12px] text-[#c0c0c0] hover:text-[#2FB7A3] transition-colors duration-150"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backHome')}
          </Link>
          <span className="text-[11px]" style={{ color: '#d1d5db' }}>
            {t('copyright', { year: new Date().getFullYear() })}
          </span>
        </div>
      </div>

      {/* ── RIGHT — video panel ───────────────────────────────────── */}
      <div
        className="hidden lg:flex relative flex-col flex-none overflow-hidden"
        style={{ width: '68%', borderRadius: 20 }}
      >
        <Image
          src="/fondo-login-litsea-centro-capacitacion-bienestar.webp"
          alt="Litsea Centro de Capacitación — Riviera Maya"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,40,36,0.92) 0%, rgba(10,40,36,0.48) 40%, rgba(0,0,0,0.08) 100%)',
          }}
        />

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-9 pb-10">
          <h1 className="text-white font-bold leading-[1.25] mb-3" style={{ fontSize: 'clamp(22px,2.4vw,34px)' }}>
            {t('videoTitle')}
          </h1>
          <p className="text-white/70 leading-relaxed max-w-sm" style={{ fontSize: 13.5 }}>
            {t('videoSubtitle')}
          </p>
        </div>
      </div>

    </div>
  )
}
