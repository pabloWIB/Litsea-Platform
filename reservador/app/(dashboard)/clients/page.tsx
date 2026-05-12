import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import ClientsList from '@/components/dashboard/ClientsList'

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

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('reservations')
    .select('client_name, phone, client_email, total_amount, remaining_balance, check_in, created_at, status')
    .order('check_in', { ascending: false })

  // Group by client name + phone
  const map = new Map<string, ClientRow>()
  for (const r of rows ?? []) {
    const key = `${r.client_name.toLowerCase().trim()}|${(r.phone ?? '').trim()}`
    if (!map.has(key)) {
      map.set(key, {
        name:         r.client_name,
        phone:        r.phone,
        email:        r.client_email,
        reservations: 0,
        cancelled:    0,
        totalSpent:   0,
        totalPending: 0,
        lastCheckIn:  r.check_in,
      })
    }
    const c = map.get(key)!
    c.reservations++
    if (r.status === 'cancelled') {
      c.cancelled++
    } else {
      c.totalSpent   += r.total_amount   ?? 0
      c.totalPending += r.remaining_balance ?? 0
    }
    if (new Date(r.check_in) > new Date(c.lastCheckIn)) {
      c.lastCheckIn = r.check_in
    }
  }

  const clients = Array.from(map.values()).sort(
    (a, b) => new Date(b.lastCheckIn).getTime() - new Date(a.lastCheckIn).getTime()
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Clientes</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          {clients.length} huéspedes registrados
        </p>
      </div>

      <Suspense>
        <ClientsList clients={clients} />
      </Suspense>
    </div>
  )
}
