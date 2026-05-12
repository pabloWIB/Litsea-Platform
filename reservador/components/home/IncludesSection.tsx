import { getTranslations } from 'next-intl/server'
import { Coffee, Waves, Flame, TreePine, Car, Dog, Bed, Wind, Home } from 'lucide-react'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const ICONS = [Coffee, Waves, Flame, TreePine, Car, Dog, Bed, Wind, Home]
const KEYS  = ['breakfast', 'jacuzzi', 'bonfire', 'hiking', 'parking', 'pets', 'bathroom', 'hammock', 'dome'] as const

export default async function IncludesSection() {
  const t = await getTranslations('home')

  return (
    <section className="bg-white border-y border-neutral-100 py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-2">
          {t('includesTitle')}
        </p>
        <h2 className="text-center text-xl font-bold text-neutral-900 mb-8">
          {t('includesSubtitle')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i]
            return (
              <div key={key} className="relative rounded-xl border border-neutral-100 bg-stone-50 p-2">
                <GlowingEffect spread={25} glow={true} disabled={false} proximity={40} inactiveZone={0.01} />
                <div className="relative flex items-center gap-2.5 rounded-lg px-2 py-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 leading-tight">
                    {t(`includes.${key}` as any)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
