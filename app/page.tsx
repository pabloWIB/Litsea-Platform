import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Próximamente — Litsea Empleos",
  description:
    "Litsea Empleos está en construcción. Pronto conectaremos terapeutas egresados de Litsea con los mejores spas y hoteles de la Riviera Maya.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FCF4E6] flex flex-col lg:flex-row lg:items-center lg:gap-12 px-6 sm:px-10 xl:px-16 py-10 sm:py-14">

      <div className="w-full lg:w-1/2 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src="/spa-wellness-terapeuta-ilustracion-vectorial-minimalista.png"
          alt="Terapeuta certificada Litsea"
          width={1600}
          height={900}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-auto"
          priority
        />
      </div>

      <div className="flex-1 flex flex-col justify-between gap-8 pt-10 lg:pt-0 min-h-[50vh] lg:min-h-[80vh]">

        <p className="text-[11px] uppercase tracking-[0.3em] text-[#4A7C59] font-bold">
          Litsea Empleos
        </p>

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#4A7C59] font-bold mb-5">
            Próximamente
          </p>
          <h1 className="font-black uppercase leading-[0.92] tracking-tight text-[#00372c] text-[7vw] sm:text-[10vw] lg:text-[5.5vw] xl:text-[5vw]">
            Conectamos<br />
            terapeutas<br />
            <span className="text-[#4A7C59]">con el lujo.</span>
          </h1>
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
    </main>
  );
}