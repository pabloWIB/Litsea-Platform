'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock, Unlock, X, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Reservation = {
  id: string
  client_name: string
  plan_name: string
  check_in: string
  check_out: string
  status: string
}

type BlockedDate = {
  id: string
  date: string
  reason: string | null
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS   = ['Do','Lu','Ma','Mi','Ju','Vi','Sá']

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstDay(y: number, m: number)    { return new Date(y, m, 1).getDay() }
function dateKey(ts: string) { return ts.split('T')[0] }

function labelDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${parseInt(d)} de ${MONTHS[parseInt(m) - 1]}`
}

// Build occupancy map: date → reservations active on that night
function buildOccupiedMap(reservations: Reservation[]): Record<string, Reservation[]> {
  const map: Record<string, Reservation[]> = {}
  for (const r of reservations) {
    if (r.status === 'cancelled') continue
    const cur = new Date(dateKey(r.check_in))
    const end = new Date(dateKey(r.check_out))
    while (cur < end) {
      const key = cur.toISOString().split('T')[0]
      if (!map[key]) map[key] = []
      map[key].push(r)
      cur.setDate(cur.getDate() + 1)
    }
  }
  return map
}

export default function DashboardAvailabilityCalendar({
  reservations,
  blockedDates: initialBlocked,
}: {
  reservations: Reservation[]
  blockedDates: BlockedDate[]
}) {
  const router   = useRouter()
  const today    = new Date()
  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected,  setSelected]  = useState<string | null>(null)
  const [blocked,   setBlocked]   = useState<BlockedDate[]>(initialBlocked)
  const [reason,    setReason]    = useState('')
  const [busy,      setBusy]      = useState(false)

  const occupiedMap = buildOccupiedMap(reservations)
  const blockedMap  = Object.fromEntries(blocked.map(b => [b.date, b]))

  // ── Navigation ────────────────────────────────────────────
  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
    setSelected(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
    setSelected(null)
  }

  // ── Day color ─────────────────────────────────────────────
  function dayBg(date: string): string {
    if (blockedMap[date]) return 'bg-neutral-100 text-neutral-400'
    const count = occupiedMap[date]?.length ?? 0
    if (date === todayStr) return 'ring-2 ring-orange-400 text-neutral-900'
    if (count === 0) return 'text-neutral-700 hover:bg-green-50'
    if (count >= 4)  return 'bg-red-50 text-red-500'
    if (count >= 3)  return 'bg-amber-50 text-amber-600'
    return 'bg-orange-50/60 text-orange-700'
  }

  function dotColor(date: string): string {
    if (blockedMap[date]) return 'bg-neutral-300'
    const count = occupiedMap[date]?.length ?? 0
    if (count === 0) return 'bg-green-400'
    if (count >= 4)  return 'bg-red-400'
    if (count >= 3)  return 'bg-amber-400'
    return 'bg-orange-400'
  }

  // ── Block a date ──────────────────────────────────────────
  async function block() {
    if (!selected || busy) return
    setBusy(true)
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selected, reason: reason.trim() || null }),
      })
      if (res.ok) {
        const row = await res.json()
        setBlocked(prev => [...prev, row])
        setReason('')
        router.refresh()
      }
    } finally {
      setBusy(false)
    }
  }

  // ── Unblock a date ────────────────────────────────────────
  async function unblock(date: string) {
    if (busy) return
    setBusy(true)
    try {
      const res = await fetch(`/api/blocked-dates/${date}`, { method: 'DELETE' })
      if (res.ok) {
        setBlocked(prev => prev.filter(b => b.date !== date))
        if (selected === date) setSelected(null)
        router.refresh()
      }
    } finally {
      setBusy(false)
    }
  }

  // ── Detail panel content ──────────────────────────────────
  const selReservations = selected ? (occupiedMap[selected] ?? []) : []
  const selBlocked      = selected ? blockedMap[selected] : null
  const isPast          = selected ? selected < todayStr : false

  // ── Upcoming reservations (next 30 days) ──────────────────
  const upcoming = reservations
    .filter(r => r.status !== 'cancelled' && dateKey(r.check_in) >= todayStr)
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
    .slice(0, 12)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* ── Calendar ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-neutral-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <p key={d} className="text-center text-[10px] font-semibold text-neutral-400">{d}</p>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay(viewYear, viewMonth) }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth(viewYear, viewMonth) }, (_, i) => {
              const day  = i + 1
              const date = isoDate(viewYear, viewMonth, day)
              const isSelected = date === selected
              const count = occupiedMap[date]?.length ?? 0
              const isBlocked = !!blockedMap[date]

              return (
                <button
                  key={day}
                  onClick={() => setSelected(isSelected ? null : date)}
                  className={`relative h-10 w-full text-xs rounded-lg transition-all font-medium
                    ${isSelected ? 'ring-2 ring-orange-500 bg-orange-500 text-white' : dayBg(date)}
                  `}
                >
                  {day}
                  {/* occupancy label */}
                  {!isBlocked && count > 0 && !isSelected && (
                    <span className="absolute top-0.5 right-0.5 text-[9px] font-bold opacity-60">
                      {count}
                    </span>
                  )}
                  {/* dot indicator */}
                  {!isSelected && (
                    <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor(date)}`} />
                  )}
                  {/* blocked lock icon */}
                  {isBlocked && !isSelected && (
                    <span className="absolute top-0.5 right-0.5">
                      <Lock size={8} className="text-neutral-400" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
            {[
              { color: 'bg-green-400',   label: 'Libre' },
              { color: 'bg-orange-400',  label: '1–2 domos' },
              { color: 'bg-amber-400',   label: '3 domos' },
              { color: 'bg-red-400',     label: 'Lleno' },
              { color: 'bg-neutral-300', label: 'Bloqueado' },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Detail panel ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col gap-4">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 text-neutral-400">
              <CalendarDays size={28} className="mb-3 text-neutral-300" />
              <p className="text-sm">Selecciona un día del calendario</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="font-bold text-neutral-900">{labelDate(selected)}</p>
                <button onClick={() => setSelected(null)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={16} />
                </button>
              </div>

              {/* Occupancy summary */}
              <div className="flex items-center gap-2">
                {[...Array(4)].map((_, i) => {
                  const filled = i < (occupiedMap[selected]?.length ?? 0)
                  return (
                    <div key={i} className={`h-2 flex-1 rounded-full ${filled ? 'bg-orange-400' : 'bg-neutral-100'}`} />
                  )
                })}
                <span className="text-xs text-neutral-500 ml-1 shrink-0">
                  {occupiedMap[selected]?.length ?? 0}/4 domos
                </span>
              </div>

              {/* Reservations that day */}
              {selReservations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Reservas</p>
                  {selReservations.map(r => (
                    <a
                      key={r.id}
                      href={`/reservations/${r.id}`}
                      className="block bg-stone-50 rounded-xl px-3 py-2.5 hover:bg-orange-50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-neutral-900">{r.client_name}</p>
                      <p className="text-xs text-neutral-400">{r.plan_name}</p>
                    </a>
                  ))}
                </div>
              )}

              {/* Block / unblock */}
              {selBlocked ? (
                <div className="space-y-3">
                  <div className="bg-neutral-50 rounded-xl px-3 py-2.5 border border-neutral-200">
                    <p className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5 mb-0.5">
                      <Lock size={11} /> Día bloqueado
                    </p>
                    {selBlocked.reason && (
                      <p className="text-xs text-neutral-600">{selBlocked.reason}</p>
                    )}
                  </div>
                  <button
                    onClick={() => unblock(selected)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Unlock size={14} />
                    Desbloquear
                  </button>
                </div>
              ) : !isPast ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Bloquear día</p>
                  <input
                    type="text"
                    placeholder="Motivo (opcional)"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15"
                  />
                  <button
                    onClick={block}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 w-full bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Lock size={14} />
                    Bloquear este día
                  </button>
                  <p className="text-[11px] text-neutral-400 text-center">
                    El día aparecerá sin disponibilidad en el sitio web
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-400 text-center py-4">Fecha pasada</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Próximas reservas ─────────────────────────────── */}
      {upcoming.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">
            Próximas reservas
          </p>
          <div className="space-y-2">
            {upcoming.map(r => (
              <a
                key={r.id}
                href={`/reservations/${r.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{r.client_name}</p>
                  <p className="text-xs text-neutral-400 truncate">{r.plan_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-neutral-600">{labelDate(dateKey(r.check_in))}</p>
                  <p className="text-[11px] text-neutral-400">→ {labelDate(dateKey(r.check_out))}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
