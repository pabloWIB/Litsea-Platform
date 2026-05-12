'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main
      className="min-h-screen flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14"
      style={{ backgroundColor: '#FBF5E8' }}
    >
      <div className="flex-1 flex flex-col justify-between gap-8 pt-10 lg:pt-0 min-h-[50vh] lg:min-h-[80vh]">

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7C5C2E] font-bold">
          Glamping Reserva del Ruiz
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7C5C2E] font-bold mb-5">
            Error inesperado
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-[#2A1F0E] text-[13vw] sm:text-[10vw] lg:text-[5.5vw] xl:text-[5vw]">
            Algo salió<br />
            mal.
          </h1>
          <p className="mt-6 text-sm text-[#7C5C2E] max-w-sm leading-relaxed">
            Ocurrió un error inesperado. Puedes intentarlo de nuevo o volver al inicio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <HoverBorderGradient
              as="button"
              onClick={reset}
              containerClassName="border-orange-400 cursor-pointer"
              className="bg-orange-500 text-white text-sm font-semibold px-7 py-3"
            >
              Intentar de nuevo
            </HoverBorderGradient>
            <Link href="/" className="inline-flex">
              <HoverBorderGradient
                as="div"
                containerClassName="border-orange-400 cursor-pointer"
                className="bg-orange-500 text-white text-sm font-semibold px-7 py-3"
              >
                Volver al inicio
              </HoverBorderGradient>
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-[#B59A72]">
          © {new Date().getFullYear()} Glamping Reserva del Ruiz · El glamping de un millón de estrellas
        </p>

      </div>

      <div className="w-full lg:w-1/2 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src="/ilustracion-domo-naturaleza.webp"
          alt="Domo glamping en la naturaleza — Reserva del Ruiz"
          width={1600}
          height={900}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-auto"
          priority
        />
      </div>
    </main>
  )
}
