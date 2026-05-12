'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { useLocale } from 'next-intl'

type DayStatus = { occupied: number; available: number }
type AvailData  = Record<string, DayStatus>
type Plan       = { id: string; name: string; price: number; is_flat: boolean }

const DAYS: Record<string, string[]> = {
  es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  fr: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
}
const MONTHS: Record<string, string[]> = {
  es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function firstDay(y: number, m: number)    { return new Date(y, m, 1).getDay() }
function fmtCOP(n: number)                 { return '$' + Math.round(n).toLocaleString('es-CO') }
function nightsBetween(a: string, b: string) {
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

export default function AvailabilityCalendar({ plans }: { plans: Plan[] }) {
  const t      = useTranslations('availability')
  const locale = useLocale()

  const DAYS_L   = DAYS[locale]   ?? DAYS.es
  const MONTHS_L = MONTHS[locale] ?? MONTHS.es

  function labelDate(iso: string) {
    const [, m, d] = iso.split('-')
    return `${parseInt(d)} de ${MONTHS_L[parseInt(m) - 1]}`
  }

  const today     = new Date()
  const todayStr  = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [avail,     setAvail]     = useState<AvailData>({})
  const [loading,   setLoading]   = useState(true)
  const [checkIn,   setCheckIn]   = useState<string | null>(null)
  const [checkOut,  setCheckOut]  = useState<string | null>(null)
  const [planId,    setPlanId]    = useState(plans[0]?.id ?? '')

  const m2 = viewMonth === 11 ? 0  : viewMonth + 1
  const y2 = viewMonth === 11 ? viewYear + 1 : viewYear

  useEffect(() => {
    async function load() {
      setLoading(true)
      const start = isoDate(viewYear, viewMonth, 1)
      const lastDay = daysInMonth(y2, m2)
      const end   = isoDate(y2, m2, lastDay)
      try {
        const res  = await fetch(`/api/availability?start=${start}&end=${end}`)
        const data = await res.json()
        setAvail(prev => ({ ...prev, ...data }))
      } catch { /* non-fatal */ }
      setLoading(false)
    }
    load()
  }, [viewYear, viewMonth])

  function handleDay(date: string) {
    if (date < todayStr) return
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date); setCheckOut(null)
    } else if (date <= checkIn) {
      setCheckIn(date); setCheckOut(null)
    } else {
      setCheckOut(date)
    }
  }

  function dotColor(date: string) {
    const occ = avail[date]?.occupied ?? -1
    if (occ < 0)  return 'bg-neutral-200'
    if (occ >= 4) return 'bg-red-400'
    if (occ >= 3) return 'bg-amber-400'
    return 'bg-green-400'
  }

  function dayClass(date: string) {
    const past    = date < todayStr
    const isCi    = date === checkIn
    const isCo    = date === checkOut
    const inRange = checkIn && checkOut && date > checkIn && date < checkOut
    const occ     = avail[date]?.occupied ?? 0

    if (past)           return 'text-neutral-200 cursor-not-allowed'
    if (isCi || isCo)   return 'bg-orange-500 text-white font-bold shadow-sm scale-110 z-10 cursor-pointer'
    if (inRange)        return 'bg-orange-100 text-orange-700 rounded-none cursor-pointer'
    if (occ >= 4)       return 'bg-red-50 text-red-300 cursor-pointer'
    if (occ >= 3)       return 'bg-amber-50 text-amber-600 cursor-pointer hover:bg-amber-100'
    return 'hover:bg-green-50 text-neutral-800 cursor-pointer'
  }

  function renderMonth(y: number, m: number) {
    const days  = daysInMonth(y, m)
    const start = firstDay(y, m)
    return (
      <div>
        <p className="text-center text-sm font-bold text-neutral-800 mb-3">
          {MONTHS_L[m]} {y}
        </p>
        <div className="grid grid-cols-7 mb-1">
          {DAYS_L.map(d => (
            <p key={d} className="text-center text-[10px] font-semibold text-neutral-400">{d}</p>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: start }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const day  = i + 1
            const date = isoDate(y, m, day)
            return (
              <button
                key={day}
                onClick={() => handleDay(date)}
                disabled={date < todayStr}
                className={`relative h-9 w-full text-xs rounded-lg transition-all ${dayClass(date)}`}
              >
                {day}
                {date >= todayStr && date !== checkIn && date !== checkOut && (
                  <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor(date)}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const plan   = plans.find(p => p.id === planId)
  const nights = (!plan?.is_flat && checkIn && checkOut) ? nightsBetween(checkIn, checkOut) : 0
  const price  = plan ? (plan.is_flat ? plan.price : nights * plan.price) : 0

  function waUrl() {
    if (!checkIn || !plan) return 'https://wa.me/573152779642'
    let msg = `Hola! Me interesa reservar en el Glamping Reserva del Ruiz 🏕️\n\nPlan: ${plan.name}\nLlegada: ${labelDate(checkIn)}`
    if (checkOut && !plan.is_flat) msg += `\nSalida: ${labelDate(checkOut)}`
    if (price > 0)                 msg += `\nPrecio estimado: ${fmtCOP(price)}`
    return `https://wa.me/573152779642?text=${encodeURIComponent(msg)}`
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonthNav() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
        {[
          { color: 'bg-green-400',  label: t('available') },
          { color: 'bg-amber-400',  label: t('partial')   },
          { color: 'bg-red-400',    label: t('full')      },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
          </span>
        ))}
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-neutral-700">
            {MONTHS_L[viewMonth]} · {MONTHS_L[m2]} {y2 !== viewYear ? y2 : ''}
          </span>
          <button onClick={nextMonthNav}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {loading && (
          <p className="text-center text-xs text-neutral-400 py-4">{t('loading')}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {renderMonth(viewYear, viewMonth)}
          {renderMonth(y2, m2)}
        </div>
      </div>

      {/* Selection + price card */}
      {checkIn && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-900">{t('selection')}</h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">{t('arrival')}</p>
              <p className="text-sm font-semibold text-neutral-900">{labelDate(checkIn)}</p>
            </div>
            {checkOut && !plan?.is_flat && (
              <div className="bg-stone-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">{t('departure')}</p>
                <p className="text-sm font-semibold text-neutral-900">{labelDate(checkOut)}</p>
              </div>
            )}
          </div>

          {/* Plan selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1.5">{t('planLabel')}</label>
            <select
              value={planId}
              onChange={e => setPlanId(e.target.value)}
              className="w-full text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {fmtCOP(p.price)}{p.is_flat ? '' : t('perNightShort')}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          {price > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">{t('estimatedPrice')}</p>
                {nights > 0 && (
                  <p className="text-xs text-orange-400">{nights} {nights !== 1 ? t('nights', { count: nights }) : t('nights', { count: 1 })}</p>
                )}
                {plan?.is_flat && (
                  <p className="text-xs text-orange-400">{t('dayInfo')}</p>
                )}
              </div>
              <p className="text-2xl font-extrabold text-orange-500">{fmtCOP(price)}</p>
            </div>
          )}

          {/* CTA */}
          <a href={waUrl()} target="_blank" rel="noopener noreferrer" className="mt-5 block">
            <HoverBorderGradient
              as="div"
              containerClassName="border-green-400 cursor-pointer w-full"
              className="bg-green-500 text-white text-sm font-semibold py-3 flex items-center justify-center gap-2 w-full"
            >
              <MessageCircle size={16} />
              {t('ctaAvailable')}
            </HoverBorderGradient>
          </a>
        </div>
      )}

      <p className="text-center text-xs text-neutral-400 leading-relaxed">
        {t('note')}
      </p>
    </div>
  )
}
