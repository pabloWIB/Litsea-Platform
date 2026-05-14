'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const EASE = [0.22, 1, 0.36, 1] as const

export default function CtaSectionHome() {
  const t = useTranslations('ctaFinal')

  return (
    <section className="bg-[#071210] pb-20 md:pb-28 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 md:mb-12 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95]">
            {t('title1')}<br />
            <span className="text-[#2FB7A3]">{t('title2')}</span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed mt-4 max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-px bg-white/6 rounded-3xl overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative bg-[#071210] overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[320px]"
        >
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#071210] via-[#071210]/80 to-[#071210]/40" />

          <div className="relative z-10 flex flex-col gap-5 h-full justify-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#2FB7A3] font-bold mb-3">
                {t('cardTerapeutaLabel')}
              </p>
              <h3 className="text-2xl md:text-3xl font-black uppercase leading-[0.95] text-white">
                {t('cardTerapeutaTitle1')}<br />
                <span className="text-[#2FB7A3]">{t('cardTerapeutaTitle2')}</span>
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mt-3 max-w-xs">
                {t('cardTerapeutaDesc')}
              </p>
            </div>
            <Link href="/registro-terapeuta">
              <HoverBorderGradient
                as="div"
                containerClassName="cursor-pointer"
                backdropClassName="bg-[#2FB7A3]"
                className="px-6 py-2.5 text-sm font-semibold text-white"
              >
                {t('cardTerapeutaCta')}
              </HoverBorderGradient>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
          className="relative bg-[#0d2420] overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[320px]"
        >
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/ilustracion-bienestar-aprobacion-documentos-ui.png"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d2420] via-[#0d2420]/80 to-[#0d2420]/40" />

          <div className="relative z-10 flex flex-col gap-5 h-full justify-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#2FB7A3] font-bold mb-3">
                {t('cardEmpleadorLabel')}
              </p>
              <h3 className="text-2xl md:text-3xl font-black uppercase leading-[0.95] text-white">
                {t('cardEmpleadorTitle1')}<br />
                <span className="text-[#2FB7A3]">{t('cardEmpleadorTitle2')}</span>
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mt-3 max-w-xs">
                {t('cardEmpleadorDesc')}
              </p>
            </div>
            <Link href="/registro-empleador">
              <HoverBorderGradient
                as="div"
                containerClassName="cursor-pointer border-white/25"
                backdropClassName="bg-white/8"
                className="px-6 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                {t('cardEmpleadorCta')}
              </HoverBorderGradient>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
