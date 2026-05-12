import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Inicio',          href: '/' },
  { label: 'Paquetes',        href: '/paquetes' },
  { label: 'Disponibilidad',  href: '/disponibilidad' },
  { label: 'Galería',         href: '/galeria' },
  { label: 'Cómo llegar',     href: '/como-llegar' },
  { label: 'Opiniones',       href: '/opiniones' },
  { label: 'Contacto',        href: '/contacto' },
]

const LEGAL_LINKS = [
  { label: 'Política de cancelación', href: '/politica-cancelacion' },
  { label: 'Términos y condiciones',  href: '/terminos' },
  { label: 'Política de privacidad',  href: '/privacidad' },
]

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/glampingreservadelruiz/',
    icon: <Instagram className="size-5" />,
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=61578345478511',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@reservadelruiz',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-green-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo + tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/img/logo-reserva-del-ruiz.jpg"
                alt="Glamping Reserva del Ruiz"
                width={120}
                height={120}
                className="rounded-full"
              />
            </Link>
            <p className="mt-4 text-sm text-green-300 leading-relaxed">
              El glamping de un millón de estrellas.
              <br />A 30 minutos de Manizales, Caldas.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-orange-500 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-200 transition hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://wa.me/573152779642"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-green-200 transition hover:text-orange-400"
                >
                  <Phone className="mt-0.5 size-4 shrink-0" />
                  +57 315 2779642
                </a>
              </li>
              <li>
                <a
                  href="mailto:glampingreservadelruiz@gmail.com"
                  className="flex items-start gap-2 text-sm text-green-200 transition hover:text-orange-400"
                >
                  <Mail className="mt-0.5 size-4 shrink-0" />
                  glampingreservadelruiz@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-green-200">
                <MapPin className="mt-0.5 size-4 shrink-0 text-orange-400" />
                Vereda Montaño, Villamaría<br />Caldas — A 30 min de Manizales
              </li>
            </ul>
          </div>

          {/* Mapa */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Ubicación
            </h3>
            <div className="mt-4 overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13581.706562354393!2d-75.44852697313321!3d4.980492210306577!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4763fe51655cab%3A0x6c68ba32b7d75b67!2sGlamping%20Reserva%20del%20Ruiz!5e0!3m2!1ses!2sco!4v1778360458509!5m2!1ses!2sco"
                width="100%"
                height="160"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Glamping Reserva del Ruiz"
              />
            </div>
          </div>
        </div>

        {/* Divider + legal */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-green-400">
              © {year} Glamping Reserva del Ruiz. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-4">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-green-400 transition hover:text-orange-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
