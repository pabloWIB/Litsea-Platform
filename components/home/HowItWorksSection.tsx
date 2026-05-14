'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

const STEP_ICONS = [
  (
    <svg className="w-6 h-6 text-[#2FB7A3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  (
    <svg className="w-6 h-6 text-[#2FB7A3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  (
    <svg className="w-6 h-6 text-[#2FB7A3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  (
    <svg className="w-6 h-6 text-[#2FB7A3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  ),
]

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks')

  const STEPS = [
    { number: '01', title: t('step1Title'), description: t('step1Desc'), icon: STEP_ICONS[0] },
    { number: '02', title: t('step2Title'), description: t('step2Desc'), icon: STEP_ICONS[1] },
    { number: '03', title: t('step3Title'), description: t('step3Desc'), icon: STEP_ICONS[2] },
    { number: '04', title: t('step4Title'), description: t('step4Desc'), icon: STEP_ICONS[3] },
  ]

  return (
    <section id="como-funciona" className="bg-[#071210] py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 md:mb-20"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95]">
            {t('title1')}<br />
            <span className="text-[#2FB7A3]">{t('title2')}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-white/6 rounded-2xl overflow-hidden">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
              className="bg-[#071210] p-8 md:p-10 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#2FB7A3]/10 border border-[#2FB7A3]/20 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-5xl font-black text-white/6 tabular-nums">{step.number}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="mt-px grid grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden"
        >
          {[
            { value: t('stat1Value'), label: t('stat1Label') },
            { value: t('stat2Value'), label: t('stat2Label') },
            { value: t('stat3Value'), label: t('stat3Label') },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#071210] px-6 py-5 text-center">
              <p className="text-xl md:text-2xl font-black text-[#2FB7A3]">{stat.value}</p>
              <p className="text-[11px] text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
