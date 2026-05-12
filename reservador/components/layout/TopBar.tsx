'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { BannerContext } from '@/context/BannerContext'
import { useTranslations } from 'next-intl'

// ─── Banner data ───────────────────────────────────────────────
const FECHAS = [
  { m: 2,  d: 9,  nombre: 'Día del Periodista' },
  { m: 2,  d: 14, nombre: 'Día de San Valentín' },
  { m: 2,  d: 20, nombre: 'Día del Camarógrafo y Fotógrafo' },
  { m: 3,  d: 1,  nombre: 'Día del Contador' },
  { m: 3,  d: 8,  nombre: 'Día Internacional de la Mujer' },
  { m: 3,  d: 12, nombre: 'Día de los Amigos' },
  { m: 3,  d: 14, nombre: 'Día del Trabajador de Construcción' },
  { m: 3,  d: 15, nombre: 'Día Mundial del Consumidor' },
  { m: 3,  d: 19, nombre: 'Día del Hombre' },
  { m: 3,  d: 27, nombre: 'Día Internacional del Teatro' },
  { m: 4,  d: 7,  nombre: 'Día Mundial de la Salud' },
  { m: 4,  d: 10, nombre: 'Día del Florista' },
  { m: 4,  d: 22, nombre: 'Día de la Tierra' },
  { m: 4,  d: 26, nombre: 'Día de la Secretaria' },
  { m: 4,  d: 27, nombre: 'Día del Diseñador Gráfico' },
  { m: 4,  d: 30, nombre: 'Día del Niño' },
  { m: 5,  d: 8,  nombre: 'Día de la Madre' },
  { m: 5,  d: 10, nombre: 'Día del Veterinario' },
  { m: 5,  d: 12, nombre: 'Día de la Enfermera' },
  { m: 5,  d: 15, nombre: 'Día del Maestro' },
  { m: 5,  d: 21, nombre: 'Día de la Afrocolombianidad' },
  { m: 5,  d: 23, nombre: 'Día del Comerciante' },
  { m: 6,  d: 5,  nombre: 'Día del Medio Ambiente' },
  { m: 6,  d: 19, nombre: 'Día del Padre' },
  { m: 6,  d: 22, nombre: 'Día del Abogado' },
  { m: 7,  d: 3,  nombre: 'Día del Economista' },
  { m: 7,  d: 13, nombre: 'Día del Panadero' },
  { m: 7,  d: 16, nombre: 'Día del Transportador' },
  { m: 8,  d: 4,  nombre: 'Día del Periodista y Comunicador' },
  { m: 8,  d: 11, nombre: 'Día del Nutricionista' },
  { m: 8,  d: 17, nombre: 'Día del Ingeniero' },
  { m: 8,  d: 26, nombre: 'Día del Tendero' },
  { m: 8,  d: 28, nombre: 'Día del Adulto Mayor' },
  { m: 9,  d: 17, nombre: 'Día de Amor y Amistad' },
  { m: 9,  d: 27, nombre: 'Día del Turismo' },
  { m: 9,  d: 29, nombre: 'Día Internacional del Café' },
  { m: 10, d: 3,  nombre: 'Día del Odontólogo' },
  { m: 10, d: 4,  nombre: 'Día del Mesero' },
  { m: 10, d: 12, nombre: 'Día de la Raza' },
  { m: 10, d: 20, nombre: 'Día del Cocinero o Chef' },
  { m: 10, d: 22, nombre: 'Día del Trabajador Social' },
  { m: 10, d: 27, nombre: 'Día del Arquitecto' },
  { m: 10, d: 31, nombre: 'Halloween' },
  { m: 11, d: 4,  nombre: 'Día del Administrador' },
  { m: 11, d: 20, nombre: 'Día del Psicólogo' },
  { m: 11, d: 22, nombre: 'Día del Músico' },
  { m: 12, d: 3,  nombre: 'Día Panamericano del Médico' },
  { m: 12, d: 10, nombre: 'Día del Sociólogo' },
  { m: 12, d: 16, nombre: 'Día de Aguinaldo' },
]
const MESES = ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const WA_BANNER = 'https://wa.me/573152779642?text=Hola!%20Quiero%20reservar%20para%20una%20fecha%20especial%20en%20Glamping%20Reserva%20del%20Ruiz.'

function getClosest() {
  const hoy   = new Date()
  const mes   = hoy.getMonth() + 1
  const dia   = hoy.getDate()
  const hoyCmp = new Date(hoy.getFullYear(), mes - 1, dia).getTime()
  const diff   = (f: typeof FECHAS[0]) =>
    (new Date(hoy.getFullYear(), f.m - 1, f.d).getTime() - hoyCmp) / 86_400_000
  const sorted = [...FECHAS].sort((a, b) => {
    const score = (d: number) => (d >= 0 ? d : 365 + d)
    return score(diff(a)) - score(diff(b))
  })
  return sorted[0]
}

// ─── Nav data ──────────────────────────────────────────────────
const NAV_LINKS = [
  { key: 'packages',     href: '/paquetes'       },
  { key: 'availability', href: '/disponibilidad' },
  { key: 'gallery',      href: '/galeria'        },
  { key: 'howToGet',     href: '/como-llegar'    },
  { key: 'contact',      href: '/contacto'       },
]
const WA_NAV = 'https://wa.me/573152779642?text=Hola!%20Me%20gustaria%20consultar%20disponibilidad%20en%20Glamping%20Reserva%20del%20Ruiz.'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="size-3.5 fill-white shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.544 4.07 1.497 5.783L0 24l6.395-1.68A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.795.997 1.013-3.7-.233-.38A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z" />
  </svg>
)

// ─── TopBar ────────────────────────────────────────────────────
export default function TopBar({ children }: { children: React.ReactNode }) {
  const [bannerOpen,   setBannerOpen]   = useState(true)
  const [dismissed,    setDismissed]    = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [topbarHeight, setTopbarHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const tNav   = useTranslations('nav')
  const fecha  = getClosest()
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/fr'

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setTopbarHeight(el.offsetHeight))
    ro.observe(el)
    setTopbarHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      if (!dismissed) setBannerOpen(window.scrollY <= 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  const dismiss = () => { setDismissed(true); setBannerOpen(false) }

  const isActive = (href: string) => pathname.startsWith(href)

  const navBg      = scrolled
    ? 'bg-white shadow-sm border-b border-neutral-200'
    : 'bg-white/90 backdrop-blur-sm border-b border-neutral-100'
  const mutedColor = 'text-neutral-500'
  const hoverBg    = 'hover:bg-neutral-100 hover:text-neutral-900'
  const activeColor = 'text-orange-500'

  return (
    <BannerContext.Provider value={{ open: bannerOpen, topbarHeight }}>
      {/* ── Single fixed container ── */}
      <div ref={containerRef} className="fixed inset-x-0 top-0 z-[200] flex flex-col overflow-hidden">

        {/* Banner row */}
        <AnimatePresence>
          {bannerOpen && fecha && (
            <motion.div
              key="banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 56, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#F97316] w-full grid grid-cols-[1fr_auto_1fr] items-center px-4 shrink-0 overflow-hidden"
              style={{ minHeight: 0 }}
            >
              <div aria-hidden />
              <div className="flex items-center gap-2 sm:gap-4 text-white">
                <p className="text-sm font-medium leading-none">
                  <span className="font-bold">{fecha.d} {MESES[fecha.m]}</span>
                  {' · '}
                  {fecha.nombre}
                </p>
                <span className="hidden sm:block text-white/40">—</span>
                <a
                  href={WA_BANNER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 hover:text-white/80 transition-colors whitespace-nowrap"
                >
                  {tNav('celebrateBanner')}
                </a>
              </div>
              <div className="flex justify-end pr-2">
                <button
                  onClick={dismiss}
                  aria-label="Cerrar"
                  className="flex items-center justify-center size-7 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
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
        {(!isHome || !bannerOpen) && <motion.div
            key="navbar"
            className={`w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${navBg}`}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              duration: 0.6,
              delay: isHome ? 0.2 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6">
            {/* Desktop */}
            <div className="hidden lg:flex items-center justify-between py-3">
              <Link href="/" className="shrink-0">
                <Image src="/web-app-manifest-192x192.png" alt="Glamping Reserva del Ruiz" width={36} height={36} className="size-9" priority />
              </Link>

              <div className="flex items-center gap-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                      isActive(link.href) ? `${activeColor} font-semibold` : `${mutedColor} ${hoverBg}`
                    }`}
                  >
                    {tNav(link.key as any)}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <HoverBorderGradient
                  as="div"
                  containerClassName="border-neutral-200 cursor-pointer"
                  className="bg-white px-3 py-0 flex items-center"
                >
                  <LocaleSwitcher selectClassName="text-xs font-semibold text-black bg-white border-none outline-none cursor-pointer appearance-none py-1.5" />
                </HoverBorderGradient>
                <a href={WA_NAV} target="_blank" rel="noopener noreferrer">
                  <HoverBorderGradient
                    as="div"
                    containerClassName="border-orange-400 cursor-pointer"
                    className="flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-5 py-2"
                  >
                    {WA_ICON}
                    {tNav('book')}
                  </HoverBorderGradient>
                </a>
              </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between py-3">
                <Link href="/" className="shrink-0">
                  <Image src="/web-app-manifest-192x192.png" alt="Glamping Reserva del Ruiz" width={32} height={32} className="size-8" priority />
                </Link>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <HoverBorderGradient
                    as="div"
                    containerClassName="border-white/30 cursor-pointer"
                    className="bg-white px-3 py-0 flex items-center"
                  >
                    <LocaleSwitcher selectClassName="text-xs font-semibold text-black bg-white border-none outline-none cursor-pointer appearance-none py-1.5" />
                  </HoverBorderGradient>
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className={`size-9 flex items-center justify-center rounded-lg transition-colors ${mutedColor} ${hoverBg}`}
                    aria-label="Menú"
                  >
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

              <AnimatePresence>
                {mobileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="mt-2 bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_32px_rgba(0,0,0,0.10)] p-2 flex flex-col gap-0.5"
                  >
                    {NAV_LINKS.map((link, i) => (
                      <motion.div key={link.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block text-sm px-4 py-3 rounded-xl transition-colors ${
                            isActive(link.href) ? 'font-semibold text-orange-500 bg-orange-50' : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {tNav(link.key as any)}
                        </Link>
                      </motion.div>
                    ))}
                    <div className="mt-1 border-t border-neutral-100 pt-2 px-2 pb-1">
                      <a
                        href={WA_NAV}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center w-full rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2.5 text-white text-sm font-semibold"
                      >
                        {tNav('bookWhatsApp')}
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </motion.div>}
        </AnimatePresence>
      </div>

      {/* Page content — context available here */}
      {children}
    </BannerContext.Provider>
  )
}
