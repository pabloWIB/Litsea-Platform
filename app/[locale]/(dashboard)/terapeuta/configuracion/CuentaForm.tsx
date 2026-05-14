'use client'

import { useState, useTransition } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'

interface Props {
  initialName:       string
  currentEmail:      string
  onChangeName:      (fd: FormData) => Promise<void>
  onChangePassword:  (fd: FormData) => Promise<void>
  onChangeEmail:     (fd: FormData) => Promise<void>
  onDeleteAccount:   () => Promise<void>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-neutral-800">{title}</h2>
      {children}
    </div>
  )
}

function SaveBtn({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <button type="submit" disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-[#2FB7A3] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#27a090] disabled:opacity-60">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Guardar
      </button>
      {saved && <span className="text-sm font-medium text-emerald-600">¡Guardado!</span>}
    </div>
  )
}

export default function CuentaForm({ initialName, currentEmail, onChangeName, onChangePassword, onChangeEmail, onDeleteAccount }: Props) {
  const [nameSaved,   setNameSaved]   = useState(false)
  const [passSaved,   setPassSaved]   = useState(false)
  const [emailSaved,  setEmailSaved]  = useState(false)
  const [showDelete,  setShowDelete]  = useState(false)
  const [nameP,   startName]   = useTransition()
  const [passP,   startPass]   = useTransition()
  const [emailP,  startEmail]  = useTransition()
  const [deleteP, startDelete] = useTransition()

  const flash = (setter: (v: boolean) => void) => {
    setter(true); setTimeout(() => setter(false), 3000)
  }

  return (
    <div className="space-y-4">

      <Section title="Nombre completo">
        <form onSubmit={e => { e.preventDefault(); startName(async () => { await onChangeName(new FormData(e.currentTarget)); flash(setNameSaved) }) }}>
          <input name="full_name" defaultValue={initialName}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]"
          />
          <div className="mt-3"><SaveBtn pending={nameP} saved={nameSaved} /></div>
        </form>
      </Section>

      <Section title="Correo electrónico">
        <p className="text-xs text-neutral-500">Actual: <span className="font-medium text-neutral-700">{currentEmail}</span></p>
        <form onSubmit={e => { e.preventDefault(); startEmail(async () => { await onChangeEmail(new FormData(e.currentTarget)); flash(setEmailSaved) }) }}>
          <input name="new_email" type="email" placeholder="nuevo@email.com"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]"
          />
          <p className="text-xs text-neutral-400 mt-1">Recibirás un correo de confirmación en la nueva dirección.</p>
          <div className="mt-3"><SaveBtn pending={emailP} saved={emailSaved} /></div>
        </form>
      </Section>

      <Section title="Contraseña">
        <form onSubmit={e => { e.preventDefault(); startPass(async () => { await onChangePassword(new FormData(e.currentTarget)); flash(setPassSaved); (e.target as HTMLFormElement).reset() }) }}>
          <input name="new_password" type="password" placeholder="Mínimo 8 caracteres" minLength={8}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2FB7A3]"
          />
          <div className="mt-3"><SaveBtn pending={passP} saved={passSaved} /></div>
        </form>
      </Section>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-red-800">Eliminar cuenta</h2>
            <p className="text-xs text-red-600 mt-0.5">Esta acción desactivará tu cuenta. Contacta al soporte para eliminación permanente.</p>
          </div>
        </div>
        {!showDelete ? (
          <button type="button" onClick={() => setShowDelete(true)}
            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
            Eliminar mi cuenta
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-700">¿Estás seguro? Esta acción no se puede deshacer fácilmente.</p>
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
