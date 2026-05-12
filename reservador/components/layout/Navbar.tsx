'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { useBannerOpen } from '@/context/BannerContext'

const NAV_LINKS = [
  { label: 'Paquetes',       href: '/paquetes' },
  { label: 'Disponibilidad', href: '/disponibilidad' },
  { label: 'Galería',        href: '/galeria' },
  { label: 'Contacto',       href: '/contacto' },
]

const WA_HREF =
  'https://wa.me/573152779642?text=Hola!%20Me%20gustaria%20consultar%20disponibilidad%20en%20Glamping%20Reserva%20del%20Ruiz.'

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const pillBg = scrolled
    ? 'bg-white border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
    : 'bg-black/20 backdrop-blur-md border-white/20'

  const textColor  = scrolled ? 'text-neutral-800' : 'text-white'
  const mutedColor = scrolled ? 'text-neutral-500' : 'text-white/70'
  const hoverBg    = scrolled ? 'hover:bg-neutral-100 hover:text-neutral-900' : 'hover:bg-white/10 hover:text-white'

  const bannerOpen = useBannerOpen()

  const isHome = pathname === '/' || pathname === '/en' || pathname === '/fr'
  if (isHome) return null

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <motion.nav
      className={`fixed inset-x-0 z-[201] mx-auto w-full max-w-[1400px] px-4 lg:px-6 transition-[top] duration-300 ${bannerOpen ? 'top-[68px]' : 'top-4'}`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className={`hidden lg:flex items-center justify-between px-3 py-2 rounded-full border transition-all duration-300 ${pillBg}`}>

        <Link href="/" className="flex items-center shrink-0 pl-1">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="Glamping Reserva del Ruiz"
            width={36}
            height={36}
            className="size-9"
            priority
          />
        </Link>

        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${
                isActive(link.href)
                  ? 'text-orange-500 font-semibold'
                  : `${mutedColor} ${hoverBg}`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 pr-1">
          <LocaleSwitcher />
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer">
            <HoverBorderGradient
              as="div"
              containerClassName="border-orange-400 cursor-pointer"
              className="flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-5 py-2"
            >
              <svg viewBox="0 0 24 24" className="size-3.5 fill-white shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.544 4.07 1.497 5.783L0 24l6.395-1.68A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.795.997 1.013-3.7-.233-.38A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z" />
              </svg>
              Reservar
            </HoverBorderGradient>
          </a>
        </div>
      </div>

      <div className="lg:hidden">
        <div className={`flex items-center justify-between rounded-full px-3 py-2 border transition-all duration-300 ${pillBg}`}>

          <Link href="/" className="flex items-center">
            <Image
              src="/web-app-manifest-192x192.png"
              alt="Glamping Reserva del Ruiz"
              width={32}
              height={32}
              className="size-8"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`size-9 flex items-center justify-center rounded-lg transition-colors ${mutedColor} ${hoverBg}`}
              aria-label="Abrir menú"
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
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm px-4 py-3 rounded-xl transition-colors ${
                      isActive(link.href)
                        ? 'font-semibold text-orange-500 bg-orange-50'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-1 border-t border-neutral-100 pt-2 px-2 pb-1">
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2.5 text-white text-sm font-semibold"
                >
                  Reservar por WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
