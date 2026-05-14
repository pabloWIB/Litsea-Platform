'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Search, SlidersHorizontal, ExternalLink, CalendarDays,
  ChevronRight, AlertCircle,
} from 'lucide-react'

type Status = 'confirmed' | 'pending' | 'cancelled' | 'completed'

type Reservation = {
  id: string
  created_at: string
  client_name: string
  phone: string | null
  plan_name: string
  check_in: string
  check_out: string
  nights: number
  total_amount: number
  paid_amount: number
  remaining_balance: number
  status: Status
  drive_folder_url: string | null
  calendar_event_id: string | null
  notes: string | null
}

const STATUS_TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'all',       label: 'Todas'      },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'pending',   label: 'Pendientes'  },
  { key: 'completed', label: 'Completadas' },
  { key: 'cancelled', label: 'Canceladas'  },
]

const STATUS_BADGE: Record<Status, { label: string; className: string }> = {
  confirmed: { label: 'Confirmada', className: 'bg-green-50 text-green-700 border border-green-100'  },
  pending:   { label: 'Pendiente',  className: 'bg-amber-50 text-amber-700 border border-amber-100'  },
  cancelled: { label: 'Cancelada',  className: 'bg-red-50 text-red-600 border border-red-100'        },
  completed: { label: 'Completada', className: 'bg-neutral-100 text-neutral-600 border border-neutral-200' },
}

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

export default function ReservationsList({ reservations }: { reservations: Reservation[] }) {
  const searchParams = useSearchParams()
  const [search,       setSearch]       = useState(searchParams.get('search') ?? '')
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [pendingOnly,  setPendingOnly]  = useState(false)

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (search && !r.client_name.toLowerCase().includes(search.toLowerCase()) &&
          !r.plan_name.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (pendingOnly && r.remaining_balance <= 0) return false
      return true
    })
  }, [reservations, search, statusFilter, pendingOnly])

  return (
    <div className="space-y-4">

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">

        <div className="flex items-center gap-0.5 px-4 pt-3 border-b border-neutral-100 overflow-x-auto">
          {STATUS_TABS.map(({ key, label }) => {
            const count = key === 'all'
              ? reservations.length
              : reservations.filter((r) => r.status === key).length
            const active = statusFilter === key
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap border-b-2 transition-colors ${
                  active
                    ? 'text-orange-600 border-orange-500'
                    : 'text-neutral-400 border-transparent hover:text-neutral-700'
                }`}
              >
                {label}
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-orange-100 text-orange-600' : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o plan…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 text-neutral-900 placeholder:text-neutral-400 transition-all"
            />
          </div>
          <button
            onClick={() => setPendingOnly(!pendingOnly)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
              pendingOnly
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <AlertCircle size={13} />
            Con saldo pendiente
          </button>
          <div className="flex items-center gap-1 text-xs text-neutral-400 ml-auto">
            <SlidersHorizontal size={13} />
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-neutral-200 p-12 text-center">
          <p className="text-sm font-medium text-neutral-500">No se encontraron reservas</p>
          <p className="text-xs text-neutral-400 mt-1">Intenta cambiar los filtros o crear una nueva reserva</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Cliente</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Plan</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Fechas</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Total</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Saldo</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((r) => {
                  const badge = STATUS_BADGE[r.status]
                  return (
                    <tr key={r.id} className="hover:bg-neutral-50 transition-colors group">

                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-neutral-900 group-hover:text-orange-600 transition-colors">
                          {r.client_name}
                        </p>
                        {r.phone && (
                          <p className="text-xs text-neutral-400 mt-0.5">{r.phone}</p>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="text-sm text-neutral-700">{r.plan_name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{r.nights} {r.nights === 1 ? 'noche' : 'noches'}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="text-sm text-neutral-700">
                          {format(new Date(r.check_in), 'd MMM', { locale: es })}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          → {format(new Date(r.check_out), 'd MMM yyyy', { locale: es })}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-semibold text-neutral-900">{fmt(r.total_amount)}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Pagado: {fmt(r.paid_amount)}</p>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {r.remaining_balance > 0 ? (
                          <span className="text-sm font-semibold text-amber-600">{fmt(r.remaining_balance)}</span>
                        ) : (
                          <span className="text-sm text-neutral-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {r.drive_folder_url && (
                            <a
                              href={r.drive_folder_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir en Drive"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          <Link
                            href={`/reservations/${r.id}`}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="Ver detalle"
                          >
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-neutral-50">
            {filtered.map((r) => {
              const badge = STATUS_BADGE[r.status]
              return (
                <Link
                  key={r.id}
                  href={`/reservations/${r.id}`}
                  className="flex items-start justify-between px-4 py-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-neutral-900 truncate">{r.client_name}</p>
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">{r.plan_name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <CalendarDays size={11} className="text-neutral-400 shrink-0" />
                      <p className="text-xs text-neutral-400">
                        {format(new Date(r.check_in), 'd MMM', { locale: es })} → {format(new Date(r.check_out), 'd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-sm font-semibold text-neutral-900">{fmt(r.total_amount)}</p>
                    {r.remaining_balance > 0 && (
                      <p className="text-xs text-amber-600 mt-0.5">Debe: {fmt(r.remaining_balance)}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}
