'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#FEF8F1] flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14">

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
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#00372c] px-7 py-3 text-white font-semibold text-sm hover:bg-[#00251e] transition-colors"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#00372c]/30 px-7 py-3 text-[#00372c] font-semibold text-sm hover:bg-[#00372c]/5 transition-colors"
            >
              Volver al dashboard
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