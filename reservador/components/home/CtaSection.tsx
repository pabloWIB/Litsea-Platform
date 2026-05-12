import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MessageCircle, CalendarDays } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const WA_MESSAGES: Record<string, string> = {
  es: 'Hola! Me gustaría reservar en Glamping Reserva del Ruiz.',
  en: 'Hello! I would like to book at Glamping Reserva del Ruiz.',
  fr: 'Bonjour! Je voudrais réserver au Glamping Reserva del Ruiz.',
}

export default async function CtaSection({ locale }: { locale: string }) {
  const t      = await getTranslations('home')
  const msg    = WA_MESSAGES[locale] ?? WA_MESSAGES.es
  const waHref = `https://wa.me/573152779642?text=${encodeURIComponent(msg)}`

  return (
    <section className="bg-neutral-900 py-16 px-4 text-center">
      <p className="text-orange-400 text-[11px] font-semibold uppercase tracking-widest mb-3">
        {t('ctaKicker')}
      </p>
      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-3">
        {t('ctaTitle')}
      </h2>
      <p className="text-neutral-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
        {t('ctaText')}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href={waHref} target="_blank" rel="noopener noreferrer">
          <HoverBorderGradient
            as="div"
            containerClassName="border-green-400 cursor-pointer"
            className="bg-green-500 text-white text-sm font-semibold px-7 py-3 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            {t('ctaButton')}
          </HoverBorderGradient>
        </a>
        <Link href="/disponibilidad">
          <HoverBorderGradient
            as="div"
            containerClassName="border-white/30 cursor-pointer"
            className="bg-white/10 text-white text-sm font-semibold px-7 py-3 flex items-center justify-center gap-2"
          >
            <CalendarDays size={16} />
            {t('ctaAvailability')}
          </HoverBorderGradient>
        </Link>
      </div>
    </section>
  )
}
