'use client'

import { motion } from 'framer-motion'
import { Waves, ShieldCheck, Dog, Bird } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function WhySection() {
  const t = useTranslations('home')

  const items = [
    {
      icon: Waves,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      title: t('whyItem1Title'),
      desc: t('whyItem1Desc'),
    },
    {
      icon: ShieldCheck,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
      title: t('whyItem2Title'),
      desc: t('whyItem2Desc'),
    },
    {
      icon: Dog,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      title: t('whyItem3Title'),
      desc: t('whyItem3Desc'),
    },
    {
      icon: Bird,
      bg: 'bg-orange-50',
      iconColor: 'text-orange-500',
      title: t('whyItem4Title'),
      desc: t('whyItem4Desc'),
    },
  ]

  return (
    <section className="bg-[#FDFAF5] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-center text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-2"
        >
          {t('whyKicker')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          className="text-center text-2xl sm:text-3xl font-bold text-neutral-900 mb-10"
        >
          {t('whyTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, bg, iconColor, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            >
              <div className="relative h-full rounded-2xl border border-neutral-100 bg-white p-2 shadow-sm">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
                <div className="relative rounded-xl p-5 flex flex-col gap-3 h-full">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm mb-1">{title}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
