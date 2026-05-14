import Image from "next/image"
import Link from "next/link"
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('errors')

  return (
    <main className="fixed inset-0 z-[300] bg-[#FEF8F1] flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14 overflow-auto">

      <div className="flex-1 flex flex-col justify-between gap-8 pt-10 lg:pt-0 min-h-[50vh] lg:min-h-[80vh]">

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#4A7C59] font-bold">
          Litsea Empleos
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#4A7C59] font-bold mb-5">
            {t('404code')}
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-[#00372c] text-[8.5vw] sm:text-[6.5vw] lg:text-[3.6vw] xl:text-[3.25vw]">
            {t('pageNotFound')}
          </h1>
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2 rounded-full text-[13px] font-medium border border-[#00372c]/25 text-[#00372c] hover:bg-[#00372c]/8 transition-colors duration-150"
            >
              {t('backHome')}
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-[#8A9E8F]">
          {t('copyright', { year: new Date().getFullYear() })} ·{" "}
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
  )
}
