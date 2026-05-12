import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ReservationDetail from '@/components/dashboard/ReservationDetail'

export default async function ReservationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !reservation) notFound()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/reservations"
          className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-neutral-900 truncate">
            {reservation.client_name}
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            Reserva creada el{' '}
            {format(new Date(reservation.created_at), "d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
      </div>

      <ReservationDetail reservation={reservation} />
    </div>
  )
}
