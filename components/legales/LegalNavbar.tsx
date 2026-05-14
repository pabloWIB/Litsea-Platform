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

export default function LegalNavbar() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('legal')
  const [isPending, startTransition] = useTransition()

  const switchLocale = (next: string) =>
    startTransition(() => router.replace(pathname, { locale: next }))

  return (
    <header className="fixed inset-x-0 top-0 z-[200] bg-white border-b border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between py-3">

        <Link href="/" className="shrink-0">
          <Image
            src="/logo-litsea-principal-color.png"
            alt="Litsea Empleos"
            width={120}
            height={40}
            style={{ height: 34, width: 'auto' }}
            className="object-contain"
            priority
            loading="eager"
          />
        </Link>

        <div className="flex items-center gap-4">
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

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-[#8a8a8a] hover:text-[#2FB7A3] transition-colors duration-150"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('backHome')}
          </Link>
        </div>

      </div>
    </header>
  )
}
