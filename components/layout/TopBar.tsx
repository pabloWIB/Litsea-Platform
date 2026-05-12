'use client'

import { useState, useEffect, useRef } from 'react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { BannerContext } from '@/context/BannerContext'

const EASE = [0.22, 1, 0.36, 1] as const

export default function TopBar({ children }: { children: React.ReactNode }) {
  const [bannerOpen,   setBannerOpen]   = useState(true)
  const [dismissed,    setDismissed]    = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [topbarHeight, setTopbarHeight] = useState(56)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname     = usePathname()
  const t            = useTranslations('nav')
  const tb           = useTranslations('banner')

  const isHome = pathname === '/'

  // Measure the container height so MainWrapper can pad correctly
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setTopbarHeight(el.offsetHeight))
    ro.observe(el)
    setTopbarHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  // Scroll: banner hides >10px, navbar styles change >40px
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      if (!dismissed) setBannerOpen(window.scrollY <= 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const dismiss = () => { setDismissed(true); setBannerOpen(false) }

  const navBg = scrolled
    ? 'bg-white shadow-sm border-b border-neutral-200'
    : 'bg-white/90 backdrop-blur-sm border-b border-neutral-100'

  const NAV_LINKS = [
    { label: t('vacantes'),     href: '/vacantes' },
    { label: t('terapeutas'),   href: '/terapeutas' },
    { label: t('comoFunciona'), href: '/#como-funciona' },
  ]

  const isActive = (href: string) => pathname.startsWith(href)

  // Desktop: hide on home while banner is open. Mobile: always visible.
  const showNavDesktop = !isHome || !bannerOpen

  return (
    <BannerContext.Provider value={{ open: bannerOpen, topbarHeight }}>

      {/* Single fixed container — banner row + navbar row */}
      <div ref={containerRef} className="fixed inset-x-0 top-0 z-[200] flex flex-col overflow-hidden">

        {/* Banner row — collapses to height:0 on scroll */}
        <AnimatePresence>
          {bannerOpen && (
            <motion.div
              key="banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 56, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="bg-[#2FB7A3] w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 shrink-0 overflow-hidden"
              style={{ minHeight: 0 }}
            >
              <div aria-hidden />
              <p className="text-[13px] font-medium text-white text-center">
                <span className="hidden sm:inline">{tb('text')}&nbsp;</span>
                <Link href="/registro-terapeuta"
                  className="underline underline-offset-2 font-semibold hover:text-white/85 transition-colors">
                  {tb('cta')}
                </Link>
              </p>
              <div className="flex justify-end pr-2">
                <button onClick={dismiss} aria-label="Cerrar"
                  className="flex items-center justify-center size-7 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navbar row — always visible on mobile, conditional on desktop */}
        <div className={`w-full transition-all duration-300 ${navBg}${!showNavDesktop ? ' md:hidden' : ''}`}>
              <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6">

                {/* Desktop */}
                <div className="hidden md:flex items-center justify-between py-3">
                  <Link href="/" className="shrink-0">
                    <Image src="/logo-litsea-principal-color.png" alt="Litsea Centro de Capacitación"
                      width={100} height={38} className="h-9 w-auto object-contain" priority loading="eager" />
                  </Link>

                  <div className="flex items-center gap-0.5">
                    {NAV_LINKS.map((link) => (
                      <Link key={link.href} href={link.href}
                        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                          isActive(link.href)
                            ? 'text-[#2FB7A3] font-semibold'
                            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                        }`}>
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
                    <Link href="/registro-empleador">
                      <HoverBorderGradient as="div"
                        containerClassName="cursor-pointer"
                        backdropClassName="bg-[#2FB7A3]"
                        className="px-5 py-2 text-sm font-semibold text-white">
                        {t('soEmpleador')}
                      </HoverBorderGradient>
                    </Link>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between py-3">
                    <Link href="/" className="shrink-0">
                      <Image src="/logo-litsea-principal-color.png" alt="Litsea Centro de Capacitación"
                        width={88} height={34} className="h-8 w-auto object-contain" priority loading="eager" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
                      <button onClick={() => setMobileOpen(v => !v)}
                        className="size-9 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
                        aria-label="Abrir menú">
                        <AnimatePresence mode="wait" initial={false}>
                          {mobileOpen
                            ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}><X    className="size-5" /></motion.span>
                            : <motion.span key="menu" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="size-5" /></motion.span>
                          }
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
        </div>
      </div>

      {/* Mobile full-screen menu — outside overflow-hidden container so it covers the full viewport */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[210] bg-[#071210]/97 backdrop-blur-sm flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/logo-litsea-principal.png"
                  alt="Litsea Centro de Capacitación"
                  width={120}
                  height={46}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú"
                className="flex items-center justify-center size-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-4 mt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)}
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
              <Link href="/vacantes" onClick={() => setMobileOpen(false)}>
                <HoverBorderGradient as="div" containerClassName="w-full cursor-pointer"
                  backdropClassName="bg-[#2FB7A3]"
                  className="w-full flex items-center justify-center px-7 py-3 text-sm font-semibold text-white">
                  {t('vacantes')}
                </HoverBorderGradient>
              </Link>
              <Link href="/registro-empleador" onClick={() => setMobileOpen(false)}>
                <HoverBorderGradient as="div" containerClassName="w-full cursor-pointer"
                  backdropClassName="bg-[#2FB7A3]"
                  className="w-full flex items-center justify-center px-7 py-3 text-sm font-semibold text-white">
                  {t('soEmpleador')}
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </BannerContext.Provider>
  )
}
