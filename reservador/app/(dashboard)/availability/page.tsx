import { createClient } from '@/lib/supabase/server'
import DashboardAvailabilityCalendar from '@/components/dashboard/DashboardAvailabilityCalendar'

async function getData() {
  const supabase = await createClient()

  const today = new Date()
  const from  = new Date(today); from.setDate(today.getDate() - 7)
  const to    = new Date(today); to.setMonth(today.getMonth() + 6)

  const fromStr = from.toISOString().split('T')[0]
  const toStr   = to.toISOString().split('T')[0]

  const [{ data: reservations }, { data: blockedDates }] = await Promise.all([
    supabase
      .from('reservations')
      .select('id, client_name, plan_name, check_in, check_out, status')
      .neq('status', 'cancelled')
      .gte('check_out', fromStr)
      .lte('check_in', toStr)
      .order('check_in', { ascending: true }),

    supabase
      .from('blocked_dates')
      .select('id, date, reason')
      .gte('date', fromStr)
      .lte('date', toStr)
      .order('date', { ascending: true }),
  ])

  return {
    reservations: reservations ?? [],
    blockedDates: blockedDates ?? [],
  }
}

export default async function AvailabilityPage() {
  const { reservations, blockedDates } = await getData()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Disponibilidad</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          Vista de reservas activas y bloqueos manuales · {reservations.length} reservas cargadas
        </p>
      </div>

      <DashboardAvailabilityCalendar
        reservations={reservations}
        blockedDates={blockedDates}
      />
    </div>
  )
}
