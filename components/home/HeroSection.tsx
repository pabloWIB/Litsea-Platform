'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { useBannerOpen } from '@/context/BannerContext'

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay } })

export default function HeroSection() {
  const t  = useTranslations('nav')
  const th = useTranslations('hero')
  const bannerOpen = useBannerOpen()

  const NAV_LINKS = [
    { label: t('vacantes'),     href: '/#vacantes' },
    { label: t('terapeutas'),   href: '/#terapeutas' },
    { label: t('empleadores'),  href: '/#empleadores' },
    { label: t('comoFunciona'), href: '/#como-funciona' },
  ]

  return (
    <section className="bg-[#FDFAF5] min-h-[95vh] flex flex-col items-center p-4 md:p-6">

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex-1 overflow-hidden rounded-3xl min-h-[567px] md:min-h-[662px] w-full max-w-[1400px]"
      >
        {/* Background */}
        <motion.div className="absolute inset-0"
          initial={{ scale: 1.06 }} animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}>
          <Image
            src="/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png"
            alt="Terapeuta certificada Litsea — Riviera Maya"
            fill priority className="object-cover object-left md:object-center"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071210]/90 via-[#071210]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071210]/35 via-transparent to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col">

          {/* Desktop nav — only while TopBar is not showing its own nav */}
          <AnimatePresence>
          {bannerOpen && (
          <motion.nav
            key="hero-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:flex items-center justify-between px-6 lg:px-10 py-5 lg:py-6">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo-litsea-principal.png"
                alt="Litsea Centro de Capacitación"
                width={110}
                height={42}
                className="object-contain"
                style={{ width: 'auto' }}
                priority
                loading="eager"
              />
            </Link>

            <div className="flex items-center gap-0.5">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07, ease: 'easeOut' }}>
                  <Link href={link.href}
                    className="text-sm text-white/65 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.div className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55, ease: 'backOut' }}>
                <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.62, ease: 'backOut' }}>
                <Link href="/registro-empleador"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#071210] ring-offset-2 ring-offset-[#5E5B57] transition duration-200 hover:ring-2 hover:ring-white focus-visible:ring-2 focus-visible:ring-white">
                  {t('soEmpleador')}
                </Link>
              </motion.div>
            </div>
          </motion.nav>
          )}
          </AnimatePresence>

          <div className="flex-1" />

          {/* Content */}
          <div className="px-6 md:px-12 pb-12 md:pb-16 max-w-2xl">
            <motion.p {...fadeUp(0.55)}
              className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-5">
              {th('badge')}
            </motion.p>

            <motion.h1 {...fadeUp(0.65)}
              className="font-black uppercase leading-[0.92] tracking-tight text-white text-[7vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[4.2vw]">
              {th('title1')}<br />
              {th('title2')}<br />
              <span className="text-[#2FB7A3]">{th('title3')}</span>
            </motion.h1>

            <motion.p {...fadeUp(0.78)}
              className="text-[0.95rem] text-white/60 leading-relaxed mt-5 mb-8 max-w-md">
              {th('subtitle')}
            </motion.p>

            <motion.div {...fadeUp(0.9)} className="flex flex-wrap gap-3">
              <Link href="/registro-terapeuta"
                className="inline-flex items-center justify-center rounded-full bg-[#2FB7A3] px-7 py-3 text-sm font-semibold text-white ring-offset-2 ring-offset-black transition duration-200 hover:ring-2 hover:ring-[#2FB7A3] focus-visible:ring-2 focus-visible:ring-[#2FB7A3]">
                {th('ctaVacantes')}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
