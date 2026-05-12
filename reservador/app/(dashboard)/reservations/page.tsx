import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ReservationsList from '@/components/dashboard/ReservationsList'

export default async function ReservationsPage() {
  const supabase = await createClient()

  const { data: reservations } = await supabase
    .from('reservations')
    .select('id, created_at, client_name, phone, plan_name, check_in, check_out, nights, total_amount, paid_amount, remaining_balance, status, drive_folder_url, calendar_event_id, notes')
    .order('check_in', { ascending: false })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Reservas</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {reservations?.length ?? 0} reservas en total
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

      <Suspense>
        <ReservationsList reservations={reservations ?? []} />
      </Suspense>

    </div>
  )
}
