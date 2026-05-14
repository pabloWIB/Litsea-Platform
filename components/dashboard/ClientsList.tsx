'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Phone, Mail, TrendingUp, Users,
  AlertCircle, ArrowUpDown, List,
  Send, X, Loader2, CheckSquare, Square, Check,
} from 'lucide-react'

type ClientRow = {
  name:         string
  phone:        string | null
  email:        string | null
  reservations: number
  cancelled:    number
  totalSpent:   number
  totalPending: number
  lastCheckIn:  string
}

type SortKey = 'recent' | 'spent' | 'name'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Más reciente' },
  { key: 'spent',  label: 'Mayor gasto'  },
  { key: 'name',   label: 'Nombre A–Z'   },
]

const input = 'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all'

function fmt(n: number) { return '$' + Math.round(n).toLocaleString('es-CO') }

export default function ClientsList({ clients }: { clients: ClientRow[] }) {
  const [search,   setSearch]   = useState('')
  const [sort,     setSort]     = useState<SortKey>('recent')
  const [selected, setSelected] = useState<Set<string>>(new Set()) 

  const [composing,   setComposing]   = useState(false)
  const [subject,     setSubject]     = useState('')
  const [message,     setMessage]     = useState('')
  const [sending,     setSending]     = useState(false)
  const [sendResult,  setSendResult]  = useState<{ sent: number; failed: number } | null>(null)
  const [sendError,   setSendError]   = useState<string | null>(null)

  const totalRevenue = clients.reduce((s, c) => s + c.totalSpent,   0)
  const totalPending = clients.reduce((s, c) => s + c.totalPending, 0)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = clients.filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    )
    return [...list].sort((a, b) => {
      if (sort === 'recent') return new Date(b.lastCheckIn).getTime() - new Date(a.lastCheckIn).getTime()
      if (sort === 'spent')  return b.totalSpent - a.totalSpent
      return a.name.localeCompare(b.name, 'es')
    })
  }, [clients, search, sort])

  const key = (c: ClientRow) => `${c.name}|${c.phone ?? ''}`

  const toggle = (c: ClientRow) => setSelected(prev => {
    const k = key(c); const next = new Set(prev)
    next.has(k) ? next.delete(k) : next.add(k)
    return next
  })

  const withEmail = filtered.filter(c => c.email)
  const allVisibleSelected = withEmail.length > 0 && withEmail.every(c => selected.has(key(c)))

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected(prev => {
        const next = new Set(prev)
        withEmail.forEach(c => next.delete(key(c)))
        return next
      })
    } else {
      setSelected(prev => {
        const next = new Set(prev)
        withEmail.forEach(c => next.add(key(c)))
        return next
      })
    }
  }

  const selectedClients = clients.filter(c => selected.has(key(c)))
  const selectedWithEmail = selectedClients.filter(c => c.email)
  const selectedNoEmail   = selectedClients.filter(c => !c.email)

  async function sendCampaign() {
    if (!subject.trim() || !message.trim() || selectedWithEmail.length === 0) return
    setSending(true)
    setSendError(null)
    setSendResult(null)
    try {
      const res = await fetch('/api/email/campaign', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          clients: selectedWithEmail.map(c => ({ name: c.name, email: c.email })),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al enviar')
      setSendResult(data)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSending(false)
    }
  }

  function closeCampaign() {
    setComposing(false)
    setSendResult(null)
    setSendError(null)
    setSubject('')
    setMessage('')
  }

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Huéspedes</p>
            <Users size={13} className="text-neutral-300" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Total generado</p>
            <TrendingUp size={13} className="text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{fmt(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Saldo pendiente</p>
            <AlertCircle size={13} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{fmt(totalPending)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 text-neutral-900 placeholder:text-neutral-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={13} className="text-neutral-400 shrink-0" />
            {SORTS.map(s => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  sort === s.key
                    ? 'bg-orange-50 text-orange-600 border-orange-200'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400 shrink-0">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-neutral-200 p-12 text-center">
          <p className="text-sm font-medium text-neutral-500">No se encontraron clientes</p>
          <p className="text-xs text-neutral-400 mt-1">Prueba cambiando el texto de búsqueda</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                      {allVisibleSelected
                        ? <CheckSquare size={15} className="text-orange-500" />
                        : <Square size={15} />}
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Cliente</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Reservas</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Total gastado</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Pendiente</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Última visita</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((c, i) => {
                  const k = key(c)
                  const isSelected = selected.has(k)
                  return (
                    <tr key={i}
                      className={`transition-colors group cursor-pointer ${isSelected ? 'bg-orange-50/40' : 'hover:bg-neutral-50'}`}
                      onClick={() => toggle(c)}
                    >
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggle(c)} className="text-neutral-400 hover:text-orange-500 transition-colors">
                          {isSelected
                            ? <CheckSquare size={15} className="text-orange-500" />
                            : <Square size={15} />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-neutral-900">{c.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {c.phone && (
                            <span className="flex items-center gap-1 text-xs text-neutral-400">
                              <Phone size={10} /> {c.phone}
                            </span>
                          )}
                          {c.email ? (
                            <span className="flex items-center gap-1 text-xs text-neutral-400">
                              <Mail size={10} /> {c.email}
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-300">sin email</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-sm font-semibold text-neutral-900">{c.reservations - c.cancelled}</span>
                        {c.cancelled > 0 && (
                          <p className="text-[10px] text-neutral-400 mt-0.5">{c.cancelled} cancelada{c.cancelled !== 1 ? 's' : ''}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-semibold text-neutral-900">{fmt(c.totalSpent)}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {c.totalPending > 0
                          ? <span className="text-sm font-semibold text-amber-600">{fmt(c.totalPending)}</span>
                          : <span className="text-sm text-neutral-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-neutral-700">
                          {format(new Date(c.lastCheckIn), 'd MMM yyyy', { locale: es })}
                        </p>
                      </td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <Link
                          href={`/reservations?search=${encodeURIComponent(c.name)}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-orange-600 hover:bg-orange-50 border border-neutral-200 hover:border-orange-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <List size={11} /> Ver reservas
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-neutral-50">
            {filtered.map((c, i) => {
              const k = key(c)
              const isSelected = selected.has(k)
              return (
                <div
                  key={i}
                  onClick={() => toggle(c)}
                  className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-orange-50/40' : 'hover:bg-neutral-50'}`}
                >
                  <button onClick={e => { e.stopPropagation(); toggle(c) }} className="mt-0.5 shrink-0 text-neutral-400">
                    {isSelected
                      ? <CheckSquare size={16} className="text-orange-500" />
                      : <Square size={16} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{c.name}</p>
                    {c.phone && <p className="text-xs text-neutral-400 mt-0.5">{c.phone}</p>}
                    {!c.email && <p className="text-[10px] text-neutral-300 mt-0.5">sin email</p>}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-neutral-500">
                        {c.reservations - c.cancelled} reserva{(c.reservations - c.cancelled) !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-neutral-300">·</span>
                      <span className="text-xs text-neutral-500">
                        {format(new Date(c.lastCheckIn), 'd MMM', { locale: es })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-2 shrink-0">
                    <p className="text-sm font-bold text-neutral-900">{fmt(c.totalSpent)}</p>
                    {c.totalPending > 0 && (
                      <p className="text-xs text-amber-600 mt-0.5">Debe: {fmt(c.totalPending)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-neutral-900 text-white rounded-2xl shadow-xl px-5 py-3"
          >
            <span className="text-sm font-semibold">
              {selected.size} seleccionado{selected.size !== 1 ? 's' : ''}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400">
              {selectedWithEmail.length} con email
            </span>
            <button
              onClick={() => { setComposing(true); setSendResult(null) }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Send size={13} /> Enviar email
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) closeCampaign() }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Enviar email</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedWithEmail.length} destinatario{selectedWithEmail.length !== 1 ? 's' : ''} con email
                    {selectedNoEmail.length > 0 && (
                      <span className="text-amber-500 ml-1">· {selectedNoEmail.length} sin email (se omitirán)</span>
                    )}
                  </p>
                </div>
                <button onClick={closeCampaign} className="text-neutral-400 hover:text-neutral-700 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {sendResult ? (
                /* Success state */
                <div className="px-6 py-10 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={22} className="text-white" />
                  </div>
                  <p className="font-bold text-neutral-900">¡Emails enviados!</p>
                  <p className="text-sm text-neutral-500">
                    {sendResult.sent} enviado{sendResult.sent !== 1 ? 's' : ''}
                    {sendResult.failed > 0 && ` · ${sendResult.failed} fallido${sendResult.failed !== 1 ? 's' : ''}`}
                  </p>
                  <button
                    onClick={closeCampaign}
                    className="mt-2 px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
                      Asunto
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Una sorpresa para ti 🎉"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className={input}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      rows={6}
                      placeholder={`Escribe tu mensaje aquí. El email comenzará con "Hola [nombre]," automáticamente.`}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className={input + ' resize-none'}
                    />
                  </div>

                  {sendError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                      {sendError}
                    </p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={closeCampaign}
                      className="flex-1 py-2.5 text-sm font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={sendCampaign}
                      disabled={sending || !subject.trim() || !message.trim() || selectedWithEmail.length === 0}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50"
                    >
                      {sending
                        ? <><Loader2 size={14} className="animate-spin" /> Enviando…</>
                        : <><Send size={14} /> Enviar a {selectedWithEmail.length}</>
                      }
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
