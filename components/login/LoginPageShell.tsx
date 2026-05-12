'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

interface LoginPageShellProps {
  children: React.ReactNode
  image?: string
  imageAlt?: string
}

export function LoginPageShell({
  children,
  image = '/wellness-login-ilustracion-terapeuta-certificacion-spa.png',
  imageAlt = 'Terapeuta certificada Litsea en spa de lujo',
}: LoginPageShellProps) {
  return (
    <section className="fixed inset-0 z-[300] bg-[#071210] flex flex-col p-3 sm:p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex-1 overflow-hidden rounded-3xl min-h-[600px]"
      >
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/58" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#071210]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071210]/30 via-transparent to-transparent" />

        {/* Content layer */}
        <div className="absolute inset-0 z-10 flex flex-col">

          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="flex items-center justify-between px-6 md:px-10 py-5 md:py-6"
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#2FB7A3]/15 border border-[#2FB7A3]/30 flex items-center justify-center transition-all duration-200 group-hover:bg-[#2FB7A3]/25 group-hover:border-[#2FB7A3]/50">
                <span className="text-[#2FB7A3] font-bold text-sm">L</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Litsea Empleos</p>
                <p className="text-[#2FB7A3]/60 text-[11px]">Centro de Capacitación</p>
              </div>
            </Link>
          </motion.nav>

          {/* Form card — centered */}
          <div className="flex-1 flex items-center justify-center px-4 py-4">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.35 }}
              className="w-full max-w-[400px] bg-black/38 backdrop-blur-xl border border-white/10 rounded-2xl p-7 sm:p-8 shadow-2xl"
            >
              {children}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-center py-4 text-[11px] text-white/20"
          >
            © {new Date().getFullYear()} Litsea Centro de Capacitación · Riviera Maya, México
          </motion.footer>
        </div>
      </motion.div>
    </section>
  )
}
