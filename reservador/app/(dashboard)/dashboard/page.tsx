import { createClient } from '@/lib/supabase/server'
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowRight, Plus, TrendingUp, Clock, CalendarCheck, Tent } from 'lucide-react'
import DashboardCharts from '@/components/dashboard/DashboardCharts'

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const now = new Date()
  const monthStart = startOfMonth(now).toISOString()
  const monthEnd = endOfMonth(now).toISOString()
  const today = format(now, 'yyyy-MM-dd')
  const in7Days = addDays(now, 7).toISOString()
  const sixMonthsAgo = subMonths(startOfMonth(now), 5).toISOString()

  const [
    { data: monthRevData },
    { data: pendingData },
    { data: upcomingData },
    { data: checkinsData },
    { data: checkoutsData },
    { data: monthRes },
    { data: sixMonthData },
    { data: planData },
  ] = await Promise.all([
    supabase.from('reservations').select('total_amount')
      .neq('status', 'cancelled').gte('check_in', monthStart).lte('check_in', monthEnd),
    supabase.from('reservations').select('remaining_balance')
      .neq('status', 'cancelled').gt('remaining_balance', 0),
    supabase.from('reservations').select('id, client_name, plan_name, check_in, check_out')
      .neq('status', 'cancelled').gte('check_in', now.toISOString()).lte('check_in', in7Days).order('check_in'),
    supabase.from('reservations').select('id, client_name, plan_name')
      .neq('status', 'cancelled').gte('check_in', `${today}T00:00:00`).lte('check_in', `${today}T23:59:59`),
    supabase.from('reservations').select('id, client_name, plan_name')
      .neq('status', 'cancelled').gte('check_out', `${today}T00:00:00`).lte('check_out', `${today}T23:59:59`),
    supabase.from('reservations').select('nights')
      .neq('status', 'cancelled').gte('check_in', monthStart).lte('check_in', monthEnd),
    supabase.from('reservations').select('total_amount, check_in')
      .neq('status', 'cancelled').gte('check_in', sixMonthsAgo),
    supabase.from('reservations').select('plan_name').neq('status', 'cancelled'),
  ])

  const monthRevenue  = (monthRevData ?? []).reduce((s, r) => s + (r.total_amount ?? 0), 0)
  const pendingBalance = (pendingData ?? []).reduce((s, r) => s + (r.remaining_balance ?? 0), 0)
  const occupiedNights = (monthRes ?? []).reduce((s, r) => s + (r.nights ?? 0), 0)
  const daysInMonth   = endOfMonth(now).getDate()
  const maxCapacity   = 4 * daysInMonth
  const occupancyPct  = maxCapacity > 0 ? Math.round((occupiedNights / maxCapacity) * 100) : 0
  const upcoming      = upcomingData ?? []
  const checkinsHoy   = checkinsData ?? []
  const checkoutsHoy  = checkoutsData ?? []

  const monthMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    monthMap[format(subMonths(now, i), 'yyyy-MM')] = 0
  }
  for (const r of sixMonthData ?? []) {
    const key = (r.check_in as string).slice(0, 7)
    if (key in monthMap) monthMap[key] += r.total_amount ?? 0
  }
  const revenueChart = Object.entries(monthMap).map(([key, value]) => ({
    month: format(new Date(`${key}-15`), 'MMM', { locale: es }),
    value,
  }))

  const planMap: Record<string, number> = {}
  for (const r of planData ?? []) {
    const name = r.plan_name ?? 'Otro'
    planMap[name] = (planMap[name] ?? 0) + 1
  }
  const planChart = Object.entries(planMap).map(([name, value]) => ({ name, value }))

  const isEmpty = upcoming.length === 0 && checkinsHoy.length === 0 && checkoutsHoy.length === 0 && monthRevenue === 0

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-0.5 capitalize">
            {format(now, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <Link
          href="/reservations/new"
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Plus size={14} />
          Nueva reserva
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Revenue */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              Ingresos este mes
            </p>
            <span className="p-1.5 rounded-lg bg-orange-50">
              <TrendingUp size={13} className="text-orange-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{fmt(monthRevenue)}</p>
          <p className="text-xs text-neutral-400 mt-1 capitalize">
            {format(now, 'MMMM yyyy', { locale: es })}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              Saldo pendiente
            </p>
            <span className="p-1.5 rounded-lg bg-amber-50">
              <Clock size={13} className="text-amber-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{fmt(pendingBalance)}</p>
          <p className="text-xs text-neutral-400 mt-1">por cobrar</p>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              Próximos 7 días
            </p>
            <span className="p-1.5 rounded-lg bg-neutral-100">
              <CalendarCheck size={13} className="text-neutral-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{upcoming.length}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {upcoming.length === 1 ? 'reserva' : 'reservas'}
          </p>
        </div>

        {/* Occupancy */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 capitalize">
              Ocupación {format(now, 'MMMM', { locale: es })}
            </p>
            <span className="p-1.5 rounded-lg bg-neutral-100">
              <Tent size={13} className="text-neutral-500" />
            </span>
          </div>
          <p className="text-2xl font-bold text-neutral-900">{occupancyPct}%</p>
          <div className="mt-2 h-1 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-orange-400 transition-all"
              style={{ width: `${Math.min(occupancyPct, 100)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {occupiedNights} de {maxCapacity} noches
          </p>
        </div>

      </div>

      {/* Charts */}
      <DashboardCharts revenueData={revenueChart} planData={planChart} />

      {/* Check-ins + Check-outs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">
          <div className="px-5 py-3.5 border-b border-neutral-50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <h2 className="text-sm font-semibold text-neutral-900">Check-ins hoy</h2>
            <span className="ml-auto text-xs text-neutral-400 tabular-nums">{checkinsHoy.length}</span>
          </div>
          {checkinsHoy.length === 0 ? (
            <p className="px-5 py-5 text-sm text-neutral-300 text-center">Sin check-ins hoy</p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {checkinsHoy.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{r.client_name}</p>
                    <p className="text-xs text-neutral-400">{r.plan_name}</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                    3:00 PM
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">
          <div className="px-5 py-3.5 border-b border-neutral-50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
            <h2 className="text-sm font-semibold text-neutral-900">Check-outs hoy</h2>
            <span className="ml-auto text-xs text-neutral-400 tabular-nums">{checkoutsHoy.length}</span>
          </div>
          {checkoutsHoy.length === 0 ? (
            <p className="px-5 py-5 text-sm text-neutral-300 text-center">Sin check-outs hoy</p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {checkoutsHoy.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{r.client_name}</p>
                    <p className="text-xs text-neutral-400">{r.plan_name}</p>
                  </div>
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                    1:00 PM
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Upcoming reservations */}
      {upcoming.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm">
          <div className="px-5 py-3.5 border-b border-neutral-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Próximas reservas (7 días)</h2>
            <Link
              href="/reservations"
              className="text-xs text-orange-500 hover:text-orange-700 flex items-center gap-1 transition-colors font-medium"
            >
              Ver todas <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-neutral-50">
            {upcoming.map((r) => (
              <Link
                key={r.id}
                href={`/reservations/${r.id}`}
                className="px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900 group-hover:text-orange-600 transition-colors">
                    {r.client_name}
                  </p>
                  <p className="text-xs text-neutral-400">{r.plan_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-orange-500">
                    {format(new Date(r.check_in), 'd MMM', { locale: es })}
                  </p>
                  <p className="text-xs text-neutral-400">
                    → {format(new Date(r.check_out), 'd MMM', { locale: es })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="bg-white rounded-xl border border-dashed border-neutral-200 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <Tent size={22} className="text-orange-500" />
          </div>
          <p className="text-sm font-semibold text-neutral-900">Todo listo para empezar</p>
          <p className="text-xs text-neutral-400 mt-1 mb-5">
            Crea tu primera reserva para ver las métricas aquí
          </p>
          <Link
            href="/reservations/new"
            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2.5 rounded-xl transition-colors font-medium"
          >
            <Plus size={14} />
            Crear reserva
          </Link>
        </div>
      )}

    </div>
  )
}
