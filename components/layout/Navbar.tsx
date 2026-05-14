'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { useBannerOpen } from '@/context/BannerContext'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname   = usePathname()
  const t          = useTranslations('nav')
  const bannerOpen = useBannerOpen()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  if (pathname === '/') return null

  const pillBg = scrolled
    ? 'bg-white border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
    : 'bg-black/20 backdrop-blur-md border-white/20'

  const linkColor   = scrolled ? 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100' : 'text-white/70 hover:text-white hover:bg-white/10'
  const activeColor = 'text-[#2FB7A3] font-semibold'

  const NAV_LINKS = [
    { label: t('vacantes'),     href: '/vacantes' },
    { label: t('terapeutas'),   href: '/terapeutas' },
    { label: t('comoFunciona'), href: '/como-funciona' },
  ]

  const SECTION_LINKS = NAV_LINKS

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <motion.nav
      className="fixed inset-x-0 z-[201] mx-auto w-full max-w-5xl px-4 transition-[top] duration-300"
      style={{ top: bannerOpen ? 68 : 16 }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className={`hidden md:flex items-center justify-between px-3 py-2 rounded-full border transition-all duration-300 ${pillBg}`}>
        <Link href="/" className="flex items-center gap-2 shrink-0 pl-1">
          <Image
            src="/logo-litsea-principal-color.png"
            alt="Litsea Centro de Capacitación"
            width={90}
            height={34}
            className="object-contain"
            style={{ width: 'auto' }}
            priority
            loading="eager"
          />
        </Link>

        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${isActive(link.href) ? activeColor : linkColor}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5 pr-1">
          <LocaleSwitcher
            selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors"
          />
          <Link href="/registro-empleador"
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${scrolled ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-100' : 'border-white/30 text-white/80 hover:text-white hover:border-white/60'}`}>
            {t('soEmpleador')}
          </Link>
          <Link href="/registro-terapeuta"
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${scrolled ? 'border-neutral-300 text-neutral-800 hover:bg-neutral-100' : 'border-white/30 text-white/90 hover:text-white hover:border-white/60'}`}>
            {t('soTerapeuta')}
          </Link>
        </div>
      </div>

      <div className="md:hidden">
        <div className={`flex items-center justify-between px-3 py-2 rounded-full border transition-all duration-300 ${pillBg}`}>
          <Link href="/" className="shrink-0 pl-1">
            <Image
              src={scrolled ? '/logo-litsea-principal-color.png' : '/logo-litsea-principal.png'}
              alt="Litsea Centro de Capacitación"
              width={80}
              height={30}
              className="object-contain"
              style={{ width: 'auto' }}
              priority
              loading="eager"
            />
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher selectClassName="text-xs font-semibold bg-white text-neutral-700 border border-neutral-200 rounded-lg px-2 py-1 outline-none cursor-pointer appearance-none hover:border-neutral-400 transition-colors" />
            <button onClick={() => setMobileOpen(v => !v)} className={`size-9 flex items-center justify-center rounded-lg transition-colors ${linkColor}`} aria-label="Abrir menú">
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
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.2 }}
              className="mt-2 bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_32px_rgba(0,0,0,0.10)] p-2 flex flex-col gap-0.5">
              {SECTION_LINKS.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={link.href} className="block text-sm px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-1 border-t border-neutral-100 pt-2 px-1 pb-1 flex flex-col gap-2">
                <Link href="/registro-empleador" className="text-sm px-4 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors text-center">{t('soEmpleador')}</Link>
                <Link href="/registro-terapeuta" className="flex items-center justify-center rounded-xl bg-[#2FB7A3] hover:bg-[#3ecfbb] transition-colors px-4 py-2.5 text-white text-sm font-semibold">{t('soTerapeuta')}</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
