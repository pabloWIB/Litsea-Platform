'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const EMPLEADORES = [
  'Grand Velas Riviera Maya',
  'Rosewood Mayakoba',
  'Banyan Tree Mayakoba',
  'Hotel Xcaret Arte',
  'Andaz Mayakoba',
  'Fairmont Mayakoba',
  'Belmond Maroma',
  'NIZUC Resort & Spa',
]

export default function RedEmpleadores() {
  const t = useTranslations('redEmpleadores')

  return (
    <section className="bg-[#071210] py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 md:mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95]">
            {t('title1')}<br />
            <span className="text-[#2FB7A3]">{t('title2')}</span>
          </h2>
          <p className="text-sm text-white/38 leading-relaxed mt-4 max-w-md">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/6 rounded-2xl overflow-hidden">
          {EMPLEADORES.map((nombre, i) => (
            <motion.div
              key={nombre}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
              className="bg-[#071210] px-6 py-8 flex items-center justify-center"
            >
              <p className="text-[12px] font-semibold text-white/35 text-center leading-snug hover:text-white/65 transition-colors cursor-default select-none">
                {nombre}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
