import { createClient } from '@/lib/supabase/server'
import PlansList from '@/components/dashboard/PlansList'

export default async function PlansPage() {
  const supabase = await createClient()

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Planes y precios</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          Los cambios se reflejan automáticamente en el formulario de reservas y el sitio web.
        </p>
      </div>

      <PlansList plans={plans ?? []} />
    </div>
  )
}
