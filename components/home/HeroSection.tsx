'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { Button as StatefulButton } from '@/components/ui/stateful-button'

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp  = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay } })
const fadeDown = (delay = 0) => ({ initial: { opacity: 0, y: -16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: EASE, delay } })

export default function HeroSection() {
  const t  = useTranslations('nav')
  const th = useTranslations('hero')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NAV_LINKS = [
    { label: t('vacantes'),      href: '/vacantes' },
    { label: t('terapeutas'),    href: '/terapeutas' },
    { label: t('comoFunciona'),  href: '/#como-funciona' },
  ]

  return (
    <>
      {/* Sticky navbar — appears after scrolling past hero nav */}
      <AnimatePresence>
        {scrolled && (
          <motion.header
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed top-0 left-0 right-0 z-[300] bg-[#071210]/90 backdrop-blur-md border-b border-white/10"
          >
            <div className="flex items-center justify-between px-6 md:px-10 py-3 max-w-[1400px] mx-auto">
              <Link href="/">
                <Image
                  src="/logo-litsea-principal.png"
                  alt="Litsea Centro de Capacitación"
                  width={100}
                  height={38}
                  className="h-9 w-auto object-contain"
                />
              </Link>

              <div className="hidden md:flex items-center gap-0.5">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="text-sm text-white/65 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
                </div>
                <StatefulButton
                  className="bg-[#ffffff] text-[#071210] hover:ring-[#ffffff] min-w-fit px-5 py-2 text-sm font-semibold"
                  onClick={async () => { router.push('/registro-empleador') }}
                >
                  {t('soEmpleador')}
                </StatefulButton>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

    <section className="bg-[#FDFAF5] min-h-[95vh] flex flex-col items-center p-4 md:p-6">

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[210] bg-[#071210]/97 backdrop-blur-sm flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image
                  src="/logo-litsea-principal.png"
                  alt="Litsea Centro de Capacitación"
                  width={120}
                  height={46}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú"
                className="flex items-center justify-center size-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-4 mt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}>
                  <Link href={link.href} onClick={() => setOpen(false)}
                    className="block text-2xl font-bold text-white hover:text-[#2FB7A3] transition-colors py-3 px-2 border-b border-white/10">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto px-6 pb-10 flex flex-col gap-3">
              <div className="flex justify-start py-2">
                <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
              </div>
              <Link href="/login" onClick={() => setOpen(false)}>
                <HoverBorderGradient as="div" containerClassName="w-full cursor-pointer"
                  backdropClassName="bg-[#2FB7A3]"
                  className="w-full flex items-center justify-center px-7 py-3 text-sm font-semibold text-white">
                  {t('ingresar')}
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            fill priority className="object-cover object-center"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071210]/90 via-[#071210]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071210]/35 via-transparent to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col">

          {/* Nav */}
          <motion.nav className="hidden md:flex items-center justify-between px-6 md:px-10 py-5 md:py-6" {...fadeDown(0.3)}>
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

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-0.5">
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
              <motion.div className="hidden md:flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55, ease: 'backOut' }}>
                <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
              </motion.div>

              <motion.div className="hidden md:block"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.62, ease: 'backOut' }}>
                <StatefulButton
                  className="bg-[#ffffff] text-[#071210] hover:ring-[#ffffff] min-w-fit px-7 py-3 text-sm font-semibold"
                  onClick={async () => { router.push('/registro-empleador') }}
                >
                  {t('soEmpleador')}
                </StatefulButton>
              </motion.div>

              <button onClick={() => setOpen(true)} aria-label="Abrir menú"
                className="hidden flex items-center justify-center size-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white">
                <Menu className="size-5" />
              </button>
            </div>
          </motion.nav>

          <div className="flex-1" />

          {/* Content */}
          <div className="px-6 md:px-12 pb-12 md:pb-16 max-w-2xl">
            <motion.p {...fadeUp(0.55)}
              className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-5">
              {th('badge')}
            </motion.p>

            <motion.h1 {...fadeUp(0.65)}
              className="font-black uppercase leading-[0.92] tracking-tight text-white text-[8vw] sm:text-[9vw] md:text-[7vw] lg:text-[5.5vw] xl:text-[4.8vw]">
              {th('title1')}<br />
              {th('title2')}<br />
              <span className="text-[#2FB7A3]">{th('title3')}</span>
            </motion.h1>

            <motion.p {...fadeUp(0.78)}
              className="text-[0.95rem] text-white/60 leading-relaxed mt-5 mb-8 max-w-md">
              {th('subtitle')}
            </motion.p>

            <motion.div {...fadeUp(0.9)} className="flex flex-wrap gap-3">
              <Link href="/vacantes">
                <HoverBorderGradient as="div" containerClassName="cursor-pointer"
                  backdropClassName="bg-[#2FB7A3]"
                  className="px-7 py-3 text-sm font-semibold text-white">
                  {th('ctaVacantes')}
                </HoverBorderGradient>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
    </>
  )
}
