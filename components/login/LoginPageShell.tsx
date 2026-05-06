'use client'

import Image from 'next/image'

export function LoginPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen min-h-screen">
      {/* Left — form */}
      <div className="relative flex w-full sm:w-1/2 min-h-screen flex-col bg-purple-950 px-8 py-10 sm:px-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-auto">
          <Image
            src="/img/logo.jpg"
            alt="Reserva del Ruiz"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Reserva del Ruiz</p>
            <p className="text-purple-400 text-xs">Panel de administración</p>
          </div>
        </div>

        {/* Form content */}
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[360px]">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-purple-500 mt-auto">
          El glamping de un millón de estrellas
        </p>
      </div>

      {/* Right — glamping photo */}
      <div className="hidden sm:block sm:w-1/2 min-h-screen relative">
        <Image
          src="/img/glamping.jpeg"
          alt="Reserva del Ruiz"
          fill
          sizes="50vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-purple-950/20 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <p className="text-2xl font-semibold leading-snug">
            Gestiona tus reservas<br />desde un solo lugar.
          </p>
          <p className="mt-3 text-purple-200 text-sm">
            Reserva del Ruiz — Glamping
          </p>
        </div>
      </div>
    </div>
  )
}
