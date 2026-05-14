'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Phone, Mail } from 'lucide-react'

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/litseacc/',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/litseacentrodecapacitacion',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@litseacc_pdc',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const t  = useTranslations('footer')
  const tn = useTranslations('nav')

  const NAV_LINKS = [
    { label: tn('vacantes'),     href: '/vacantes' },
    { label: tn('terapeutas'),   href: '/terapeutas' },
    { label: tn('comoFunciona'), href: '/como-funciona' },
  ]

  const LEGAL = [
    { label: t('privacidad'), href: '/privacidad' },
    { label: t('terminos'),   href: '/terminos' },
    { label: t('cookies'),    href: '/cookies' },
  ]

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-12 pb-8">

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">

          <div className="shrink-0">
            <Link href="/" className="inline-flex">
              <Image
                src="/logo-litsea-principal-color.png"
                alt="Litsea Centro de Capacitación"
                width={72}
                height={26}
                className="object-contain"
                style={{ width: 'auto' }}
              />
            </Link>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href}
                className="text-sm font-semibold text-neutral-700 hover:text-[#2FB7A3] transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {SOCIAL.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-neutral-400 hover:text-[#2FB7A3] transition-colors">
                {icon}
              </a>
            ))}
            <a href="tel:+529842337294" aria-label="Teléfono"
              className="text-neutral-400 hover:text-[#2FB7A3] transition-colors">
              <Phone size={20} />
            </a>
            <a href="mailto:empleos@litseacc.edu.mx" aria-label="Email"
              className="text-neutral-400 hover:text-[#2FB7A3] transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-neutral-200">
          <iframe
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://maps.google.com/maps?width=600&height=400&hl=es&q=litsea+centro+de+capacitacion+playa+del+carmen&t=p&z=14&ie=UTF8&iwloc=B&output=embed"
            width="100%"
            height="220"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            title="Litsea Centro de Capacitación — Playa del Carmen"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Litsea Centro de Capacitación. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-neutral-500">
            {LEGAL.map(({ label, href }, i) => (
              <React.Fragment key={href}>
                <Link href={href} className="hover:text-neutral-900 transition-colors">
                  {label}
                </Link>
                {i < LEGAL.length - 1 && (
                  <span className="text-neutral-300">|</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-neutral-300">|</span>
            <Link href="/login/admin" className="hover:text-neutral-900 transition-colors">
              {t('adminLogin')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
