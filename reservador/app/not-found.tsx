import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export const metadata: Metadata = {
  title: 'Página no encontrada — Glamping Reserva del Ruiz',
  description: 'Esta página no existe.',
}

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14"
      style={{ backgroundColor: '#FBF5E8' }}
    >
      {/* Texto — izquierda */}
      <div className="flex-1 flex flex-col justify-between gap-8 pt-10 lg:pt-0 min-h-[50vh] lg:min-h-[80vh]">

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#7C5C2E] font-bold">
          Glamping Reserva del Ruiz
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7C5C2E] font-bold mb-5">
            Error 404
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-[#2A1F0E] text-[13vw] sm:text-[10vw] lg:text-[5.5vw] xl:text-[5vw]">
            Parece que<br />
            te perdiste.
          </h1>
          <p className="mt-6 text-sm text-[#7C5C2E] max-w-sm leading-relaxed">
            No encontramos esta página, pero sí tenemos el glamping perfecto para ti. Vuelve al inicio y descubre tu próxima escapada.
          </p>
          <Link href="/" className="mt-8 inline-flex">
            <HoverBorderGradient
              as="div"
              containerClassName="border-orange-400 cursor-pointer"
              className="bg-orange-500 text-white text-sm font-semibold px-7 py-3 flex items-center gap-2.5"
            >
              <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              Volver al inicio
            </HoverBorderGradient>
          </Link>
        </div>

        <p className="text-[11px] text-[#B59A72]">
          © {new Date().getFullYear()} Glamping Reserva del Ruiz · El glamping de un millón de estrellas
        </p>

      </div>

      {/* Imagen — derecha */}
      <div className="w-full lg:w-1/2 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src="/ilustracion-404.webp"
          alt="Viajero perdido entre la naturaleza — Glamping Reserva del Ruiz"
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
