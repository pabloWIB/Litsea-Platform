'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  ExternalLink, CalendarDays, Tent, Phone, Users,
  FileText, CreditCard, CheckCircle2, FileDown,
} from 'lucide-react'

type Status = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'postponed'
type ActiveStatus = 'confirmed' | 'cancelled'

type Reservation = {
  id: string
  created_at: string
  client_name: string
  phone: string | null
  client_email: string | null
  plan_name: string
  plan_price: number
  is_flat: boolean
  check_in: string
  check_out: string
  nights: number
  guests_info: string | null
  extra_description: string | null
  extra_cost: number
  discount_percent: number
  discount_amount: number
  subtotal: number
  total_amount: number
  paid_amount: number
  remaining_balance: number
  status: Status
  notes: string | null
  drive_folder_url: string | null
  calendar_event_id: string | null
}

const STATUS_CONFIG: Record<Status, { label: string; badge: string; btn: string }> = {
  confirmed: {
    label: 'Confirmada',
    badge: 'bg-green-50 text-green-700 border border-green-100',
    btn:   'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100',
  },
  cancelled: {
    label: 'Aplazada',
    badge: 'bg-red-50 text-red-600 border border-red-100',
    btn:   'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  },
  pending:   { label: 'Pendiente',  badge: 'bg-amber-50 text-amber-700 border border-amber-100',     btn: 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' },
  completed: { label: 'Completada', badge: 'bg-neutral-100 text-neutral-600 border border-neutral-200', btn: 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200' },
  postponed: { label: 'Aplazada',   badge: 'bg-red-50 text-red-600 border border-red-100',           btn: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' },
}

const VISIBLE_STATUSES: ActiveStatus[] = ['confirmed', 'cancelled']

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-neutral-100 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="px-5 py-3.5 border-b border-neutral-50 flex items-center gap-2">
      <span className="text-neutral-400">{icon}</span>
      <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-neutral-50 last:border-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 shrink-0">{label}</p>
      <p className={`text-sm text-right ${highlight ? 'font-bold text-amber-600' : 'font-medium text-neutral-900'}`}>{value}</p>
    </div>
  )
}

export default function ReservationDetail({ reservation: initial }: { reservation: Reservation }) {
  const [res,           setRes]           = useState(initial)
  const [paymentInput,  setPaymentInput]  = useState('')
  const [registering,   setRegistering]   = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)
  const router = useRouter()

  const badge = STATUS_CONFIG[res.status]

  const handlePayment = async () => {
    const amount = Number(paymentInput)
    if (!amount || amount <= 0) { toast.error('Ingresa un monto válido'); return }
    if (amount > res.remaining_balance) { toast.error('El monto supera el saldo pendiente'); return }

    setRegistering(true)
    try {
      const newPaid    = res.paid_amount + amount
      const newBalance = res.total_amount - newPaid

      const r = await fetch(`/api/reservations/${res.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ paid_amount: newPaid, remaining_balance: newBalance }),
      })
      if (!r.ok) throw new Error('Error al registrar el pago')

      setRes(prev => ({ ...prev, paid_amount: newPaid, remaining_balance: newBalance }))
      setPaymentInput('')
      toast.success(`Pago de ${fmt(amount)} registrado`)
      if (newBalance <= 0) toast.success('¡Reserva pagada completamente!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error')
    } finally {
      setRegistering(false)
    }
  }

  const handleStatus = async (status: Status) => {
    if (status === res.status) return
    setChangingStatus(true)
    try {
      const r = await fetch(`/api/reservations/${res.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      if (!r.ok) throw new Error('Error al cambiar el estado')
      setRes(prev => ({ ...prev, status }))
      toast.success(`Estado actualizado: ${STATUS_CONFIG[status].label}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error')
    } finally {
      setChangingStatus(false)
    }
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <div className="lg:col-span-2 space-y-4">

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge.badge}`}>
            {badge.label}
          </span>
          {res.drive_folder_url && (
            <a href={res.drive_folder_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 px-3 py-1.5 rounded-full transition-colors">
              <ExternalLink size={11} /> Carpeta Drive
            </a>
          )}
          {(() => {
            const [datePart] = res.check_in.split('T')
            const [y, m, d]  = datePart.split('-')
            const calUrl = `https://calendar.google.com/calendar/u/2/r/week/${y}/${parseInt(m)}/${parseInt(d)}`
            return (
              <a href={calUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 px-3 py-1.5 rounded-full transition-colors">
                <CalendarDays size={11} /> Ver en Calendar
              </a>
            )
          })()}
          <a
            href={`/api/pdf/${res.id}`}
            download
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <FileDown size={11} /> Descargar PDF
          </a>
        </div>

        <Card>
          <CardHeader icon={<Phone size={14} />} title="Datos del cliente" />
          <div className="px-5 py-1">
            <Row label="Nombre" value={res.client_name} />
            {res.phone && <Row label="Teléfono" value={res.phone} />}
            {res.client_email && <Row label="Email" value={res.client_email} />}
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Tent size={14} />} title="Plan y fechas" />
          <div className="px-5 py-1">
            <Row label="Plan" value={res.plan_name} />
            <Row
              label={res.is_flat ? 'Precio' : 'Precio / noche'}
              value={fmt(res.plan_price)}
            />
            {!res.is_flat && <Row label="Noches" value={`${res.nights}`} />}
            <Row
              label="Check-in"
              value={format(new Date(res.check_in), "EEEE d 'de' MMMM yyyy · HH:mm", { locale: es })}
            />
            <Row
              label="Check-out"
              value={format(new Date(res.check_out), "EEEE d 'de' MMMM yyyy · HH:mm", { locale: es })}
            />
          </div>
        </Card>

        {res.guests_info && (
          <Card>
            <CardHeader icon={<Users size={14} />} title="Huéspedes" />
            <pre className="px-5 py-4 text-sm text-neutral-700 whitespace-pre-wrap font-sans leading-relaxed">
              {res.guests_info}
            </pre>
          </Card>
        )}

        <Card>
          <CardHeader icon={<CreditCard size={14} />} title="Resumen financiero" />
          <div className="px-5 py-1">
            {!res.is_flat && (
              <Row label={`Plan × ${res.nights} noches`} value={fmt(res.plan_price * res.nights)} />
            )}
            {res.is_flat && <Row label="Plan (tarifa plana)" value={fmt(res.plan_price)} />}
            {res.discount_percent > 0 && (
              <Row label={`Descuento ${res.discount_percent}%`} value={`− ${fmt(res.discount_amount)}`} />
            )}
            {res.extra_cost > 0 && (
              <Row label="Adicionales" value={fmt(res.extra_cost)} />
            )}
            {res.extra_cost > 0 && res.extra_description && (
              <p className="text-xs text-neutral-400 pb-2 break-words leading-relaxed">{res.extra_description}</p>
            )}
            <Row label="Total" value={fmt(res.total_amount)} />
            <Row label="Pagado" value={fmt(res.paid_amount)} />
            <Row
              label="Saldo pendiente"
              value={fmt(res.remaining_balance)}
              highlight={res.remaining_balance > 0}
            />
          </div>
        </Card>

        {res.notes && (
          <Card>
            <CardHeader icon={<FileText size={14} />} title="Notas internas" />
            <p className="px-5 py-4 text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {res.notes}
            </p>
          </Card>
        )}
      </div>

      <div className="space-y-4">

        <Card>
          <CardHeader icon={<CreditCard size={14} />} title="Registrar pago" />
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-semibold uppercase tracking-widest">Saldo</span>
              <span className={`font-bold ${res.remaining_balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {fmt(res.remaining_balance)}
              </span>
            </div>

            {res.remaining_balance > 0 ? (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={paymentInput}
                    onChange={e => setPaymentInput(e.target.value)}
                    placeholder="Monto recibido"
                    min="0"
                    max={res.remaining_balance}
                    className="w-full pl-7 pr-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15 transition-all placeholder:text-neutral-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentInput(String(res.remaining_balance))}
                    className="flex-1 text-xs font-medium py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-colors"
                  >
                    Pago total
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={registering || !paymentInput}
                    className="flex-1 text-xs font-semibold py-1.5 px-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {registering ? 'Guardando…' : 'Registrar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 size={15} />
                Pagado completamente
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader icon={<FileText size={14} />} title="Estado" />
          <div className="px-5 py-4 grid grid-cols-2 gap-2">
            {VISIBLE_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={changingStatus}
                className={`text-xs font-semibold py-2 px-3 rounded-lg border transition-colors text-center ${
                  (res.status === s || (s === 'cancelled' && ['cancelled','postponed'].includes(res.status)))
                    ? STATUS_CONFIG[s].badge + ' ring-2 ring-offset-1 ring-orange-300'
                    : STATUS_CONFIG[s].btn
                } disabled:opacity-50`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader icon={<FileText size={14} />} title="Información" />
          <div className="px-5 py-1">
            <Row
              label="Creada"
              value={format(new Date(initial.created_at), "d MMM yyyy · HH:mm", { locale: es })}
            />
            <Row label="ID" value={res.id.slice(0, 8) + '…'} />
          </div>
        </Card>


      </div>
    </div>
  )
}
