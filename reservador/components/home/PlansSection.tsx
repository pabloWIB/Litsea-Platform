import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Moon, Sun, ArrowRight } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { GlowingEffect } from '@/components/ui/glowing-effect'

type Plan = { id: string; name: string; price: number; is_flat: boolean }

const FALLBACK: Plan[] = [
  { id: '1', name: 'Plan Pareja Semana',        price: 350000, is_flat: false },
  { id: '2', name: 'Plan Pareja Fin de Semana', price: 420000, is_flat: false },
  { id: '3', name: 'Pasadía 8 horas',           price: 280000, is_flat: true  },
]

function fmtCOP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

export default async function PlansSection({ plans }: { plans: Plan[] }) {
  const t  = await getTranslations('home')
  const tp = await getTranslations('packages')
  const items = plans.length > 0 ? plans.slice(0, 3) : FALLBACK

  return (
    <section className="bg-stone-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-2">
          {t('packagesTitle')}
        </p>
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-neutral-900 mb-10">
          {tp('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {items.map((plan) => (
            <div key={plan.id} className="relative rounded-2xl border border-neutral-100 bg-white p-2 flex flex-col shadow-sm">
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex flex-col flex-1 rounded-xl overflow-hidden">
              <div className="p-5 flex flex-col flex-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full w-fit mb-3">
                  {plan.is_flat
                    ? <><Sun size={10} /> {t('plansBadgeDay')}</>
                    : <><Moon size={10} /> {t('plansBadgeNight')}</>
                  }
                </span>
                <h3 className="text-base font-bold text-neutral-900 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-2xl font-extrabold text-orange-500">{fmtCOP(plan.price)}</span>
                  <span className="text-neutral-400 text-xs ml-1">
                    {plan.is_flat ? `· ${tp('flatRate')}` : `· ${tp('perNight')}`}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mb-4">
                  {plan.is_flat ? t('plansTimingDay') : t('plansTimingNight')}
                </p>
                <div className="mt-auto">
                  <Link href="/disponibilidad">
                    <HoverBorderGradient
                      as="div"
                      containerClassName="border-orange-400 cursor-pointer w-full"
                      className="bg-orange-500 text-white text-sm font-semibold py-2.5 flex items-center justify-center w-full"
                    >
                      {t('plansCta')}
                    </HoverBorderGradient>
                  </Link>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/paquetes"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors"
          >
            {t('packagesCta')}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
