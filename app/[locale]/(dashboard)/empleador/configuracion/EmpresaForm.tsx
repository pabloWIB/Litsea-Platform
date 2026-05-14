'use client'

import { useState, useTransition } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import type { EmpresaData } from './page'

interface Props {
  initial:          EmpresaData
  currentEmail:     string
  onSaveEmpresa:    (fd: FormData) => Promise<void>
  onChangePassword: (fd: FormData) => Promise<void>
  onDeleteAccount:  () => Promise<void>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-neutral-800">{title}</h2>
      {children}
    </div>
  )
}

export default function EmpresaForm({ initial, currentEmail, onSaveEmpresa, onChangePassword, onDeleteAccount }: Props) {
  const [empresaSaved, setEmpresaSaved] = useState(false)
  const [passSaved,    setPassSaved]    = useState(false)
  const [showDelete,   setShowDelete]   = useState(false)
  const [empresaP, startEmpresa] = useTransition()
  const [passP,    startPass]    = useTransition()
  const [deleteP,  startDelete]  = useTransition()

  const flash = (setter: (v: boolean) => void) => {
    setter(true); setTimeout(() => setter(false), 3000)
  }

  return (
    <div className="space-y-4">

      <Section title="Información de la empresa">
        <form onSubmit={e => { e.preventDefault(); startEmpresa(async () => { await onSaveEmpresa(new FormData(e.currentTarget)); flash(setEmpresaSaved) }) }}
          className="space-y-3">

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Nombre del responsable</label>
            <input name="full_name" defaultValue={initial.full_name}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Nombre de la empresa <span className="text-red-500">*</span></label>
            <input name="company_name" defaultValue={initial.company_name} required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Sitio web</label>
            <input name="website" type="url" defaultValue={initial.website}
              placeholder="https://tuspa.com"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Descripción</label>
            <textarea name="description" defaultValue={initial.description} rows={3} maxLength={500}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3] resize-none"
              placeholder="Cuéntanos sobre tu empresa o spa…" />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={empresaP}
              className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#27a090] disabled:opacity-60">
              {empresaP && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </button>
            {empresaSaved && <span className="text-sm font-medium text-emerald-600">¡Guardado!</span>}
          </div>
        </form>
      </Section>

      <Section title="Correo electrónico">
        <p className="text-xs text-neutral-500">Actual: <span className="font-medium text-neutral-700">{currentEmail}</span></p>
        <p className="text-xs text-neutral-400">Para cambiar tu correo contacta al soporte de Litsea.</p>
      </Section>

      <Section title="Contraseña">
        <form onSubmit={e => { e.preventDefault(); startPass(async () => { await onChangePassword(new FormData(e.currentTarget)); flash(setPassSaved); (e.target as HTMLFormElement).reset() }) }}>
          <input name="new_password" type="password" placeholder="Mínimo 8 caracteres" minLength={8}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]"
          />
          <div className="flex items-center gap-3 mt-3">
            <button type="submit" disabled={passP}
              className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#27a090] disabled:opacity-60">
              {passP && <Loader2 className="size-4 animate-spin" />}
              Cambiar contraseña
            </button>
            {passSaved && <span className="text-sm font-medium text-emerald-600">¡Actualizada!</span>}
          </div>
        </form>
      </Section>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-red-800">Eliminar cuenta</h2>
            <p className="text-xs text-red-600 mt-0.5">Esta acción desactivará tu cuenta y todas tus vacantes publicadas.</p>
          </div>
        </div>
        {!showDelete ? (
          <button type="button" onClick={() => setShowDelete(true)}
            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-700">¿Estás seguro? Tus vacantes y conversaciones serán desactivadas.</p>
            <div className="flex gap-2">
              <form onSubmit={e => { e.preventDefault(); startDelete(async () => { await onDeleteAccount() }) }}>
                <button type="submit" disabled={deleteP}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-colors">
                  {deleteP && <Loader2 className="size-4 animate-spin" />}
                  Sí, eliminar
                </button>
              </form>
              <button type="button" onClick={() => setShowDelete(false)}
                className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 text-sm font-medium hover:bg-neutral-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
