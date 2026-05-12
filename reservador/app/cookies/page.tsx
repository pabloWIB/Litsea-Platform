import type { Metadata } from "next"
import Link from "next/link"
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"

export const metadata: Metadata = {
  title: "Política de Cookies | Glamping Reserva del Ruiz",
  description:
    "Conoce cómo Glamping Reserva del Ruiz utiliza cookies y tecnologías similares para garantizar el funcionamiento del sitio web.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://glampingreservadelruiz.website/cookies" },
  openGraph: {
    title: "Política de Cookies | Glamping Reserva del Ruiz",
    description: "Conoce cómo Glamping Reserva del Ruiz utiliza cookies y tecnologías similares para garantizar el funcionamiento del sitio web.",
    url: "https://glampingreservadelruiz.website/cookies",
    siteName: "Glamping Reserva del Ruiz",
    images: [{ url: "/bienvenida-glamping.webp", width: 1200, height: 630, alt: "Glamping Reserva del Ruiz" }],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Cookies | Glamping Reserva del Ruiz",
    description: "Conoce cómo Glamping Reserva del Ruiz utiliza cookies y tecnologías similares para garantizar el funcionamiento del sitio web.",
    images: ["/bienvenida-glamping.webp"],
  },
}

const sections = [
  {
    title: "1. ¿Qué son las cookies?",
    body: "Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas un sitio web. Permiten recordar información sobre tu navegación y facilitar el uso del sitio.",
  },
  {
    title: "2. Tipos de cookies que utilizamos",
    subsections: [
      {
        subtitle: "2.1 Cookies esenciales",
        body: "Son necesarias para el funcionamiento básico del sitio web. Permiten:",
        items: [
          "Mantener la sesión activa durante tu visita",
          "Recordar tus preferencias de idioma",
          "Garantizar la seguridad del sitio",
        ],
        note: "Estas cookies no pueden desactivarse, ya que son indispensables para el funcionamiento del sitio.",
      },
      {
        subtitle: "2.2 Cookies de analítica",
        body: "Utilizamos herramientas de terceros para medir el uso del sitio y mejorar su rendimiento:",
        items: ["Google Analytics", "Google Tag Manager"],
        note: "Estas herramientas recopilan información estadística y agregada. No se utilizan para identificar personalmente al usuario.",
      },
    ],
  },
  {
    title: "3. Finalidad del uso de cookies",
    body: "Las cookies utilizadas en Glamping Reserva del Ruiz tienen como finalidad:",
    items: [
      "Garantizar el funcionamiento técnico del sitio",
      "Mejorar la experiencia del usuario",
      "Analizar métricas de uso",
      "Optimizar el rendimiento y la estabilidad del sitio",
    ],
    note: "No utilizamos cookies para publicidad invasiva ni para la venta de información personal.",
  },
  {
    title: "4. Gestión de cookies",
    body: "Puedes configurar tu navegador para bloquear o eliminar cookies. La desactivación de cookies esenciales puede afectar el correcto funcionamiento del sitio.",
  },
  {
    title: "5. Transferencia y almacenamiento",
    body: "Al utilizar herramientas como Google Analytics, ciertos datos técnicos pueden ser procesados por proveedores ubicados fuera de Colombia, bajo sus respectivas políticas de privacidad.",
  },
  {
    title: "6. Cambios en esta política",
    body: "Glamping Reserva del Ruiz podrá actualizar esta Política de Cookies cuando sea necesario. La versión vigente estará siempre disponible en este sitio web.",
  },
  {
    title: "7. Contacto",
    contact: true,
  },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF5]">

      <div className="relative overflow-hidden border-b border-neutral-200 bg-white pt-10 pb-12">
        <BackgroundRippleEffect cellSize={48} />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <span className="inline-block rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500 mb-4">
            Última actualización: mayo 2025
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Política de Cookies
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">
            Glamping Reserva del Ruiz utiliza cookies para garantizar el funcionamiento
            del sitio web y mejorar la experiencia de los visitantes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-neutral-900">{s.title}</h2>

              {"subsections" in s && s.subsections ? (
                <div className="flex flex-col gap-6">
                  {s.subsections.map((sub) => (
                    <div key={sub.subtitle} className="flex flex-col gap-2 pl-4 border-l-2 border-neutral-100">
                      <h3 className="text-sm font-medium text-neutral-700">{sub.subtitle}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{sub.body}</p>
                      <ul className="flex flex-col gap-1.5">
                        {sub.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-neutral-500">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#F97316]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-neutral-400 leading-relaxed">{sub.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {"body" in s && s.body && (
                    <p className="text-sm text-neutral-500 leading-relaxed">{s.body}</p>
                  )}
                  {"items" in s && s.items && (
                    <ul className="flex flex-col gap-1.5">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-neutral-500">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#F97316]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {"note" in s && s.note && (
                    <p className="text-xs text-neutral-400 leading-relaxed">{s.note}</p>
                  )}
                  {"contact" in s && s.contact && (
                    <div className="flex flex-col gap-1 text-sm text-neutral-500">
                      <span>WhatsApp: <a href="https://wa.me/573152779642" target="_blank" rel="noopener noreferrer" className="font-medium text-[#F97316] hover:underline underline-offset-2">+57 315 2779642</a></span>
                      <span>Email: <a href="mailto:glampingreservadelruiz@gmail.com" className="font-medium text-[#F97316] hover:underline underline-offset-2">glampingreservadelruiz@gmail.com</a></span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-neutral-100 pt-8">
          <Link href="/terminos" className="text-xs text-neutral-400 hover:text-[#F97316] transition-colors underline underline-offset-2">Términos y condiciones</Link>
          <Link href="/privacidad" className="text-xs text-neutral-400 hover:text-[#F97316] transition-colors underline underline-offset-2">Política de privacidad</Link>
          <Link href="/politica-cancelacion" className="text-xs text-neutral-400 hover:text-[#F97316] transition-colors underline underline-offset-2">Política de cancelación</Link>
        </div>

        <div className="mt-6 text-xs text-neutral-400">
          © {new Date().getFullYear()} Glamping Reserva del Ruiz. Todos los derechos reservados.
        </div>
      </div>
    </div>
  )
}
