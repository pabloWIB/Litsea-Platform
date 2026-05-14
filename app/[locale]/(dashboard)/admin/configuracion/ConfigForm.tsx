'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import type { SiteConfig } from './page'

interface Props {
  initial: SiteConfig
  action: (formData: FormData) => Promise<void>
}

export default function ConfigForm({ initial, action }: Props) {
  const [allowReg,   setAllowReg]   = useState(initial.allow_registrations)
  const [homeTitle,  setHomeTitle]  = useState(initial.home_title)
  const [homeSub,    setHomeSub]    = useState(initial.home_subtitle)
  const [saved,      setSaved]      = useState(false)
  const [isPending,  startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      await action(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-neutral-900">Registro de usuarios</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Permite que nuevos terapeutas y empleadores creen cuentas.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="allow_registrations" className="sr-only peer"
              checked={allowReg} onChange={e => setAllowReg(e.target.checked)} />
            <div className="w-11 h-6 bg-neutral-200 peer-checked:bg-[#2FB7A3] rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-[#2FB7A3]/30" />
            <div className="absolute left-0.5 top-0.5 size-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Título del hero
        </label>
        <input type="text" name="home_title" value={homeTitle}
          onChange={e => setHomeTitle(e.target.value)}
          maxLength={120}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent"
        />
        <p className="text-xs text-neutral-400 text-right mt-1">{homeTitle.length}/120</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          Subtítulo del hero
        </label>
        <textarea name="home_subtitle" value={homeSub}
          onChange={e => setHomeSub(e.target.value)}
          rows={3} maxLength={300}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] focus:border-transparent resize-none"
        />
        <p className="text-xs text-neutral-400 text-right mt-1">{homeSub.length}/300</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-6 py-2.5 text-sm font-semibold text-white ring-offset-2 transition hover:ring-2 hover:ring-[#2FB7A3] disabled:opacity-60">
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Guardar cambios
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600">¡Guardado correctamente!</span>
        )}
      </div>

    </form>
  )
}
