'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { X } from 'lucide-react'
import { ZONES, SPECIALTIES, CONTRACT_TYPES } from '@/types/database'

export default function VacanteFiltros() {
  const router     = useRouter()
  const pathname   = usePathname()
  const params     = useSearchParams()
  const t          = useTranslations('vacantesPage')

  const zona        = params.get('zona') ?? ''
  const especialidad = params.get('especialidad') ?? ''
  const contrato    = params.get('contrato') ?? ''
  const hasFilters  = Boolean(zona || especialidad || contrato)

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      const qs = next.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, params],
  )

  const clear = () => router.push(pathname, { scroll: false })

  return (
    <div className="flex flex-wrap items-center gap-2.5">

      <SelectFilter
        value={zona}
        placeholder={t('filtroZona')}
        onChange={(v) => update('zona', v)}
        options={ZONES.filter((z) => z !== 'Otra')}
      />

      <SelectFilter
        value={especialidad}
        placeholder={t('filtroEspecialidad')}
        onChange={(v) => update('especialidad', v)}
        options={SPECIALTIES.filter((s) => s !== 'Otra')}
      />

      <SelectFilter
        value={contrato}
        placeholder={t('filtroContrato')}
        onChange={(v) => update('contrato', v)}
        options={[...CONTRACT_TYPES]}
      />

      {hasFilters && (
        <button
          onClick={clear}
          className="h-10 px-3.5 rounded-full text-sm text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 bg-white flex items-center gap-1.5 transition-colors"
        >
          <X className="size-3.5" />
          {t('limpiarFiltros')}
        </button>
      )}
    </div>
  )
}

function SelectFilter({
  value,
  placeholder,
  onChange,
  options,
}: {
  value: string
  placeholder: string
  onChange: (v: string) => void
  options: readonly string[] | string[]
}) {
  const isActive = Boolean(value)

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 pl-3.5 pr-8 rounded-full text-sm border appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent ${
          isActive
            ? 'border-[#2FB7A3] bg-[#2FB7A3]/5 text-[#2FB7A3] font-medium'
            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-50">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
