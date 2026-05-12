'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function LoginPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen min-h-screen">

      {/* ── Left panel — form ── */}
      <div
        className="relative flex w-full lg:w-[39%] min-h-screen flex-col px-8 py-10 sm:px-12"
        style={{ backgroundColor: '#FFFDF9' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="inline-flex items-center gap-3 group">
            <Image
              src="/web-app-manifest-512x512-color.png"
              alt="Glamping Reserva del Ruiz"
              width={38}
              height={38}
              className="rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div>
              <p className="text-neutral-900 font-semibold text-sm leading-tight">Reserva del Ruiz</p>
              <p className="text-neutral-600 text-[11px]">Panel de administración</p>
            </div>
          </Link>
        </motion.div>

        {/* Form area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 items-center justify-center py-12"
        >
          <div className="w-full max-w-[360px]">
            {children}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-[11px] text-neutral-600 mt-auto"
        >
          © {new Date().getFullYear()} Glamping Reserva del Ruiz
        </motion.p>
      </div>

      {/* ── Right panel — illustration ── */}
      <div className="hidden lg:block lg:w-[61%] min-h-screen relative overflow-hidden">
        <Image
          src="/ilustracion-domo-naturaleza.webp"
          alt="Glamping Reserva del Ruiz"
          fill
          sizes="54vw"
          className="object-cover object-right"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-12 left-10 right-10"
        >
          <p className="text-2xl font-bold text-white leading-snug tracking-tight">
            El glamping de<br />un millón de estrellas.
          </p>
          <p className="mt-2 text-white/60 text-sm">
            Villamaría, Caldas — Colombia
          </p>
        </motion.div>
      </div>

    </div>
  )
}
