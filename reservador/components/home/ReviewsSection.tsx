import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Star, ArrowRight } from 'lucide-react'

type Review = {
  id: string
  name: string
  location: string | null
  body: string
  created_at: string
}

export default async function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const t  = await getTranslations('home')
  const tr = await getTranslations('reviews')

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-2">
          {t('reviewsKicker')}
        </p>
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
          {t('reviewsTitle')}
        </h2>
        <p className="text-center text-neutral-500 text-sm mb-10 max-w-lg mx-auto">
          {t('reviewsSubtitle')}
        </p>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-stone-50 rounded-2xl p-6 border border-neutral-100 flex flex-col gap-3"
              >
                <div className="flex text-orange-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed flex-1">"{r.body}"</p>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{r.name}</p>
                  {r.location && (
                    <p className="text-neutral-400 text-xs">{r.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-2xl border border-neutral-100 py-12 px-6 max-w-md mx-auto text-center mb-8">
            <div className="flex justify-center gap-1 text-orange-200 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-neutral-500 text-sm">{tr('emptyState')}</p>
          </div>
        )}

      </div>
    </section>
  )
}
