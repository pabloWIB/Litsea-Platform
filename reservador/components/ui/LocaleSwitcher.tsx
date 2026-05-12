'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

const LOCALES = [
  { code: 'es', label: 'ES 🇨🇴' },
  { code: 'en', label: 'EN 🇬🇧' },
  { code: 'fr', label: 'FR 🇫🇷' },
]

export default function LocaleSwitcher({ selectClassName }: { selectClassName?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.replace(pathname, { locale: e.target.value })
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label="Idioma"
      className={selectClassName ?? "text-xs font-semibold text-black bg-white border border-neutral-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-neutral-400 transition-colors appearance-none"}
    >
      {LOCALES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  )
}
