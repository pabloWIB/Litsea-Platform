'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LocaleSwitcher from '@/components/ui/LocaleSwitcher'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const WA_MESSAGES: Record<string, string> = {
  es: 'Hola! Me gustaria consultar disponibilidad en Glamping Reserva del Ruiz.',
  en: 'Hello! I would like to check availability at Glamping Reserva del Ruiz.',
  fr: 'Bonjour! Je souhaite verifier la disponibilite au Glamping Reserva del Ruiz.',
}

const NAV_LINKS = [
  { key: 'packages',     href: '/paquetes'      },
  { key: 'availability', href: '/disponibilidad' },
  { key: 'gallery',      href: '/galeria'        },
  { key: 'contact',      href: '/contacto'       },
]

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="size-4 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.544 4.07 1.497 5.783L0 24l6.395-1.68A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.795.997 1.013-3.7-.233-.38A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z" />
  </svg>
)

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
})

const fadeDown = (delay = 0) => ({
  initial:    { opacity: 0, y: -16 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay },
})

const fadeIn = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { duration: 0.7, delay },
})

export default function Hero({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false)
  const t    = useTranslations('home')
  const tNav = useTranslations('nav')

  const waMsg  = WA_MESSAGES[locale] ?? WA_MESSAGES.es
  const waHref = `https://wa.me/573152779642?text=${encodeURIComponent(waMsg)}`

  return (
    <section
      className="bg-[#FDFAF5] min-h-[95vh] flex flex-col items-center p-4 md:p-6"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[210] bg-black/95 backdrop-blur-sm flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" onClick={() => setOpen(false)}>
                <Image src="/web-app-manifest-512x512.png" alt="Glamping Reserva del Ruiz" width={44} height={44} className="size-11" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center size-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1 px-4 mt-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-2xl font-bold text-white hover:text-orange-400 transition-colors py-3 px-2 border-b border-white/10"
                  >
                    {tNav(link.key as any)}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto px-6 pb-10 flex flex-col gap-4">
              <HoverBorderGradient
                as="div"
                containerClassName="border-white/30 cursor-pointer w-fit"
                className="bg-white px-3 py-0 flex items-center"
              >
                <LocaleSwitcher selectClassName="text-xs font-semibold text-black bg-white border-none outline-none cursor-pointer appearance-none py-1.5" />
              </HoverBorderGradient>
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="w-full">
                <HoverBorderGradient
                  as="div"
                  containerClassName="border-orange-400 cursor-pointer w-full"
                  className="bg-orange-500 text-white font-semibold px-6 py-3 flex items-center justify-center gap-2 w-full"
                >
                  {WA_ICON}
                  {t('heroCta2')}
                </HoverBorderGradient>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 overflow-hidden rounded-3xl min-h-[567px] md:min-h-[662px] w-full max-w-[1400px]"
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/ilustracion-glamping-fogata.webp"
            alt="Glamping Reserva del Ruiz — Villamaría, Caldas"
            fill
            priority
            className="object-cover object-right"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/[0.65]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FCE0C0]/8 via-transparent to-transparent"
          {...fadeIn(0.2)}
        />

        <div className="absolute inset-0 z-10 flex flex-col">

          <motion.nav
            className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6"
            {...fadeDown(0.3)}
          >
            <Link href="/" className="shrink-0">
              <Image
                src="/web-app-manifest-512x512.png"
                alt="Glamping Reserva del Ruiz"
                width={44}
                height={44}
                className="size-11"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07, ease: 'easeOut' }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {tNav(link.key as any)}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <HoverBorderGradient
                as="div"
                containerClassName="hidden md:flex border-white/30 cursor-pointer"
                className="bg-white px-3 py-0 flex items-center"
              >
                <LocaleSwitcher selectClassName="text-xs font-semibold text-black bg-white border-none outline-none cursor-pointer appearance-none py-1.5" />
              </HoverBorderGradient>
              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7, ease: 'backOut' }}
              >
                <Link href="/disponibilidad">
                  <HoverBorderGradient
                    as="div"
                    containerClassName="border-orange-400 cursor-pointer"
                    className="bg-orange-500 text-white text-sm font-semibold px-7 py-3"
                  >
                    {t('heroCta1')}
                  </HoverBorderGradient>
                </Link>
              </motion.div>

              <button
                onClick={() => setOpen(true)}
                className="md:hidden flex items-center justify-center size-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </motion.nav>

          <div className="flex-1" />

          <div className="px-6 md:px-12 pb-12 md:pb-16 max-w-2xl">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight"
              {...fadeUp(0.65)}
            >
              {t('heroTitle')}
            </motion.h1>

            <motion.p
              className="text-base text-white/70 leading-relaxed mt-5 mb-8"
              {...fadeUp(0.8)}
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div {...fadeUp(0.95)}>
              <Link href="/disponibilidad">
                <HoverBorderGradient
                  as="div"
                  containerClassName="border-orange-400 cursor-pointer"
                  className="bg-orange-500 text-white text-sm font-semibold px-7 py-3"
                >
                  {t('heroCta1')}
                </HoverBorderGradient>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

    </section>
  )
}
