'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { BadgeCheck, LayoutList, Zap } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const EASE = [0.22, 1, 0.36, 1] as const

export default function ParaEmpleadoresSection() {
  const t = useTranslations('paraEmpleadores')

  const BENEFICIOS = [
    {
      icon: <BadgeCheck className="w-5 h-5 text-[#2FB7A3]" />,
      titulo: t('benefit1Title'),
      descripcion: t('benefit1Desc'),
    },
    {
      icon: <LayoutList className="w-5 h-5 text-[#2FB7A3]" />,
      titulo: t('benefit2Title'),
      descripcion: t('benefit2Desc'),
    },
    {
      icon: <Zap className="w-5 h-5 text-[#2FB7A3]" />,
      titulo: t('benefit3Title'),
      descripcion: t('benefit3Desc'),
    },
  ]

  return (
    <section className="bg-[#071210] py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95] mb-5">
              {t('title1')}<br />
              <span className="text-[#2FB7A3]">{t('title2')}</span>
            </h2>
            <p className="text-sm text-white/42 leading-relaxed mb-8 max-w-sm">
              {t('subtitle')}
            </p>
            <Link href="/registro-empleador">
              <HoverBorderGradient
                as="div"
                containerClassName="cursor-pointer border-white/20 w-fit"
                backdropClassName="bg-white/8"
                className="px-6 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                {t('cta')}
              </HoverBorderGradient>
            </Link>
          </motion.div>

          <div className="flex flex-col gap-px bg-white/6 rounded-2xl overflow-hidden">
            {BENEFICIOS.map((b, i) => (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="bg-[#071210] p-7 flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2FB7A3]/10 border border-[#2FB7A3]/18 flex items-center justify-center shrink-0 mt-0.5">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{b.titulo}</h3>
                  <p className="text-[13px] text-white/42 leading-relaxed">{b.descripcion}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
