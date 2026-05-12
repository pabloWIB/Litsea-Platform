import { createClient } from '@/lib/supabase/server'
import ReviewsModerationList from '@/components/dashboard/ReviewsModerationList'

export default async function ReviewsPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, name, location, body, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Moderación de reseñas</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          Aprueba o elimina las opiniones de clientes antes de publicarlas
        </p>
      </div>
      <ReviewsModerationList reviews={reviews ?? []} />
    </div>
  )
}
