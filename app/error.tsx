'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="fixed inset-0 z-[300] bg-[#FEF8F1] flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14 overflow-auto">

      <div className="flex-1 flex flex-col justify-between gap-8 pt-10 lg:pt-0 min-h-[50vh] lg:min-h-[80vh]">

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#4A7C59] font-bold">
          Litsea Empleos
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#4A7C59] font-bold mb-5">
            Error 500
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-[#00372c] text-[13vw] sm:text-[10vw] lg:text-[5.5vw] xl:text-[5vw]">
            Algo salió<br />
            mal.
          </h1>
          <div className="mt-10">
            <Link href="/">
              <HoverBorderGradient
                as="div"
                containerClassName="cursor-pointer"
                backdropClassName="bg-[#2FB7A3]"
                className="px-7 py-3 text-sm font-semibold text-white"
              >
                Volver al inicio
              </HoverBorderGradient>
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-[#8A9E8F]">
          © {new Date().getFullYear()} Litsea Centro de Capacitación ·{" "}
          <a
            href="https://litseacc.edu.mx"
            className="hover:text-[#00372c] transition-colors underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            litseacc.edu.mx
          </a>
        </p>

      </div>

      <div className="w-full lg:w-1/2 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src="/ilustracion-bienestar-aprobacion-documentos-ui.png"
          alt=""
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
