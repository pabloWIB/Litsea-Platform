'use client'

import Link from "next/link"
import { useEffect } from "react"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#00372C] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg flex flex-col items-center text-center gap-10">

        <div className="flex flex-col items-center gap-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2FB7A3] font-bold">
            Error 500
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-white text-[15vw] sm:text-[11vw] md:text-[72px]">
            Algo salió<br />mal.
          </h1>
          <p className="text-white/40 text-sm max-w-xs">
            Ocurrió un error inesperado. Intenta volver al dashboard o contacta al equipo de soporte.
          </p>
        </div>

        <Link href="/dashboard">
          <HoverBorderGradient
            as="div"
            containerClassName="cursor-pointer"
            backdropClassName="bg-[#2FB7A3]"
            className="px-8 py-3 text-sm font-semibold text-[#00372C]"
          >
            Volver al dashboard
          </HoverBorderGradient>
        </Link>

        <p className="text-[11px] text-white/20">
          © {new Date().getFullYear()} Litsea Centro de Capacitación ·{" "}
          <a
            href="https://litseacc.edu.mx"
            className="hover:text-[#2FB7A3] transition-colors underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            litseacc.edu.mx
          </a>
        </p>

      </div>
    </main>
  )
}
