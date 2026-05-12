'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

const LOCALES = [
  { code: 'es', label: 'ES 🇲🇽' },
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
      aria-label="Idioma / Language"
      className={
        selectClassName ??
        'text-xs font-semibold bg-transparent text-white/60 hover:text-white border border-white/20 rounded-lg px-2 py-1.5 outline-none cursor-pointer transition-colors appearance-none hover:border-white/40'
      }
    >
      {LOCALES.map(({ code, label }) => (
        <option key={code} value={code} className="bg-[#071210] text-white">
          {label}
        </option>
      ))}
    </select>
  )
}
