'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
  Lock, MessageCircle, Mail, User, Eye, EyeOff,
  Loader2, Check, AlertTriangle, LogOut, Copy,
} from 'lucide-react'

type Settings = {
  whatsapp_number:  string
  whatsapp_message: string
  contact_email:    string
}

const input = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15 transition-all placeholder:text-neutral-400'

const SQL_SNIPPET = `-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS settings (
  id               text PRIMARY KEY,
  whatsapp_number  text NOT NULL DEFAULT '573152779642',
  whatsapp_message text NOT NULL DEFAULT '',
  contact_email    text NOT NULL DEFAULT '',
  updated_at       timestamptz DEFAULT now()
);
INSERT INTO settings (id) VALUES ('main') ON CONFLICT DO NOTHING;`

function SectionCard({
  icon, title, children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-neutral-50 flex items-center gap-2">
        <span className="text-neutral-400">{icon}</span>
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">{children}</label>
}

export default function SettingsForm({
  userEmail,
  settings: initial,
  tableExists,
}: {
  userEmail:   string
  settings:    Settings
  tableExists: boolean
}) {
  const router   = useRouter()
  const supabase = createClient()

  // ── Password ──────────────────────────────────────────────────
  const [newPassword,  setNewPassword]  = useState('')
  const [confirmPwd,   setConfirmPwd]   = useState('')
  const [showPwd,      setShowPwd]      = useState(false)
  const [savingPwd,    setSavingPwd]    = useState(false)

  const pwdStrength = (() => {
    if (!newPassword) return null
    if (newPassword.length < 6)                                         return { label: 'Muy corta',  color: 'bg-red-400',    w: 'w-1/4' }
    if (newPassword.length < 8)                                         return { label: 'Débil',      color: 'bg-orange-400', w: 'w-2/4' }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword))      return { label: 'Regular',    color: 'bg-yellow-400', w: 'w-3/4' }
    return                                                                     { label: 'Fuerte',     color: 'bg-green-500',  w: 'w-full' }
  })()

  const handlePasswordChange = async () => {
    if (newPassword.length < 8)       { toast.error('La contraseña debe tener al menos 8 caracteres'); return }
    if (newPassword !== confirmPwd)   { toast.error('Las contraseñas no coinciden'); return }
    setSavingPwd(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Contraseña actualizada correctamente')
      setNewPassword('')
      setConfirmPwd('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cambiar la contraseña')
    } finally {
      setSavingPwd(false)
    }
  }

  // ── WhatsApp + contact settings ───────────────────────────────
  const [waNumber,   setWaNumber]   = useState(initial.whatsapp_number)
  const [waMessage,  setWaMessage]  = useState(initial.whatsapp_message)
  const [savingWa,   setSavingWa]   = useState(false)

  const [contactEmail, setContactEmail] = useState(initial.contact_email)
  const [savingContact, setSavingContact] = useState(false)

  const saveSettings = async (fields: Partial<Settings>, setLoading: (v: boolean) => void) => {
    setLoading(true)
    try {
      const r = await fetch('/api/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      toast.success('Configuración guardada')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  // ── Sign out ──────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SNIPPET)
    toast.success('SQL copiado al portapapeles')
  }

  return (
    <div className="space-y-4">

      {/* Settings table banner */}
      {!tableExists && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-800">Tabla de configuración no encontrada</p>
              <p className="text-xs text-amber-700 mt-1">
                Para guardar la configuración de WhatsApp y contacto, ejecuta este SQL en Supabase:
              </p>
              <div className="relative mt-2">
                <pre className="text-[10px] text-amber-700 bg-amber-100 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed">
                  {SQL_SNIPPET}
                </pre>
                <button
                  onClick={copySQL}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-700 transition-colors"
                  title="Copiar SQL"
                >
                  <Copy size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Security ── */}
      <SectionCard icon={<Lock size={14} />} title="Seguridad">
        <div>
          <Label>Nueva contraseña</Label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className={`${input} pr-10`}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd(p => !p)}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {pwdStrength && (
            <div className="mt-1.5 space-y-1">
              <div className="h-1 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${pwdStrength.color} ${pwdStrength.w}`} />
              </div>
              <p className="text-[10px] text-neutral-400">{pwdStrength.label}</p>
            </div>
          )}
        </div>

        <div>
          <Label>Confirmar contraseña</Label>
          <input
            type={showPwd ? 'text' : 'password'}
            value={confirmPwd}
            onChange={e => setConfirmPwd(e.target.value)}
            className={`${input} ${confirmPwd && newPassword !== confirmPwd ? 'border-red-300 focus:border-red-400 focus:ring-red-400/15' : ''}`}
            placeholder="Repite la contraseña"
            autoComplete="new-password"
          />
          {confirmPwd && newPassword !== confirmPwd && (
            <p className="text-[10px] text-red-500 mt-1">Las contraseñas no coinciden</p>
          )}
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={savingPwd || !newPassword || !confirmPwd}
          className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          {savingPwd ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {savingPwd ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </SectionCard>

      {/* ── WhatsApp ── */}
      <SectionCard icon={<MessageCircle size={14} />} title="WhatsApp">
        <div>
          <Label>Número de WhatsApp</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">+</span>
            <input
              type="text"
              value={waNumber}
              onChange={e => setWaNumber(e.target.value.replace(/\D/g, ''))}
              className={`${input} pl-7`}
              placeholder="573152779642"
            />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            Código de país + número, sin espacios ni guiones. Ej: 573152779642
          </p>
        </div>

        <div>
          <Label>Mensaje por defecto</Label>
          <textarea
            value={waMessage}
            onChange={e => setWaMessage(e.target.value)}
            rows={3}
            className={`${input} resize-none`}
            placeholder="Hola! Me gustaría consultar disponibilidad…"
          />
          <p className="text-[10px] text-neutral-400 mt-1">
            Texto pre-llenado cuando alguien hace clic en "WhatsApp" en el sitio web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => saveSettings({ whatsapp_number: waNumber, whatsapp_message: waMessage }, setSavingWa)}
            disabled={savingWa || !tableExists}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors"
          >
            {savingWa ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {savingWa ? 'Guardando…' : 'Guardar WhatsApp'}
          </button>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 underline underline-offset-2 transition-colors"
          >
            Probar enlace →
          </a>
        </div>
      </SectionCard>

      {/* ── Contact ── */}
      <SectionCard icon={<Mail size={14} />} title="Contacto">
        <div>
          <Label>Email de contacto</Label>
          <input
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            className={input}
            placeholder="glampingreservadelruiz@gmail.com"
          />
          <p className="text-[10px] text-neutral-400 mt-1">
            Aparece en el footer y páginas legales del sitio web.
          </p>
        </div>

        <button
          onClick={() => saveSettings({ contact_email: contactEmail }, setSavingContact)}
          disabled={savingContact || !tableExists}
          className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl transition-colors"
        >
          {savingContact ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {savingContact ? 'Guardando…' : 'Guardar contacto'}
        </button>
      </SectionCard>

      {/* ── Account ── */}
      <SectionCard icon={<User size={14} />} title="Cuenta">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
              Correo electrónico
            </p>
            <p className="text-sm font-medium text-neutral-900">{userEmail}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Este es el correo del panel de administración</p>
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-50">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </SectionCard>

    </div>
  )
}
