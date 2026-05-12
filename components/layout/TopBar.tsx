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

  const NAV_LINKS: { label: string; href: string }[] = []

  const isActive = (href: string) => pathname.startsWith(href)

  // On home: show navbar only when banner is closed (scrolled)
  // On other pages: always show navbar
  const showNav = !isHome || !bannerOpen

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

        {/* Navbar row */}
        <AnimatePresence>
          {showNav && (
            <motion.div
              key="navbar"
              className={`w-full transition-all duration-500 ${navBg}`}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6">

                {/* Desktop */}
                <div className="hidden md:flex items-center justify-between py-3">
                  <Link href="/" className="shrink-0">
                    <Image src="/logo-litsea-principal.png" alt="Litsea Centro de Capacitación"
                      width={100} height={38} className="object-contain" style={{ width: 'auto' }} priority loading="eager" />
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
                        containerClassName="cursor-pointer border-neutral-200"
                        backdropClassName="bg-white"
                        className="px-4 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-900">
                        {t('soEmpleador')}
                      </HoverBorderGradient>
                    </Link>
                  </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between py-3">
                    <Link href="/" className="shrink-0">
                      <Image src="/logo-litsea-principal.png" alt="Litsea Centro de Capacitación"
                        width={88} height={34} className="object-contain" style={{ width: 'auto' }} priority loading="eager" />
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

                  <AnimatePresence>
                    {mobileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="pb-2 bg-white border-b border-neutral-200 flex flex-col gap-0.5 px-2"
                      >
                        {NAV_LINKS.map((link, i) => (
                          <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                            <Link href={link.href}
                              className={`block text-sm px-4 py-3 rounded-xl transition-colors ${
                                isActive(link.href)
                                  ? 'font-semibold text-[#2FB7A3] bg-[#2FB7A3]/8'
                                  : 'text-neutral-700 hover:bg-neutral-100'
                              }`}>
                              {link.label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="mt-1 border-t border-neutral-100 pt-2 px-2 pb-1">
                          <Link href="/registro-empleador">
                            <HoverBorderGradient as="div"
                              containerClassName="cursor-pointer border-neutral-200 w-full"
                              backdropClassName="bg-white"
                              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                              {t('soEmpleador')}
                            </HoverBorderGradient>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {children}
    </BannerContext.Provider>
  )
}
