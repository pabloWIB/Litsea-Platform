import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada — Litsea Empleos",
  description: "Esta página no existe.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF2E7] flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14">

      <div className="flex-1 flex flex-col justify-between gap-8 pt-10 lg:pt-0 min-h-[50vh] lg:min-h-[80vh]">

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#4A7C59] font-bold">
          Litsea Empleos
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#4A7C59] font-bold mb-5">
            Error 404
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-[#00372c] text-[13vw] sm:text-[10vw] lg:text-[5.5vw] xl:text-[5vw]">
            Esta página<br />
            no existe.
          </h1>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-[#00372c] px-7 py-3 text-white font-semibold text-sm hover:bg-[#00251e] transition-colors"
          >
            <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            Volver al inicio
          </Link>
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
          src="/wellness-login-ilustracion-terapeuta-certificacion-spa.png"
          alt="Terapeuta certificada Litsea"
          width={1600}
          height={900}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-auto"
          priority
        />
      </div>

    </main>
  );
}