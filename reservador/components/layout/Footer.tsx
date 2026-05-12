"use client"

import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Phone, Mail } from "lucide-react"
import { useTranslations } from 'next-intl'
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
} from "@tabler/icons-react"

const NAV_KEYS = [
  { key: 'packages',     href: "/paquetes"       },
  { key: 'availability', href: "/disponibilidad" },
  { key: 'gallery',      href: "/galeria"        },
  { key: 'howToGet',     href: "/como-llegar"    },
  { key: 'reviews',      href: "/opiniones"      },
  { key: 'contact',      href: "/contacto"       },
]

const LEGAL_KEYS = [
  { key: 'cancel',  href: "/politica-cancelacion" },
  { key: 'terms',   href: "/terminos"             },
  { key: 'privacy', href: "/privacidad"           },
]

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/glampingreservadelruiz/",      icon: IconBrandInstagram },
  { label: "Facebook",  href: "https://web.facebook.com/profile.php?id=61578345478511", icon: IconBrandFacebook  },
  { label: "TikTok",    href: "https://www.tiktok.com/@reservadelruiz",                 icon: IconBrandTiktok    },
]

export default function Footer() {
  const tNav    = useTranslations('nav')
  const tFooter = useTranslations('footer')

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-12 pb-8">

        {/* Top: Brand · Nav · Social icons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">

          {/* Logo + slogan */}
          <div>
            <Link href="/" className="inline-flex">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Glamping Reserva del Ruiz"
                width={56}
                height={56}
                className="size-14"
              />
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_KEYS.map(({ key, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-neutral-900 hover:text-[#F97316] transition-colors"
              >
                {tNav(key as any)}
              </Link>
            ))}
          </nav>

          {/* Icons: social + phone + email */}
          <div className="flex items-center gap-4">
            {SOCIAL.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-neutral-400 hover:text-[#F97316] transition-colors"
              >
                <Icon size={20} stroke={1.5} />
              </a>
            ))}
            <a
              href="https://wa.me/573152779642"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-neutral-400 hover:text-[#F97316] transition-colors"
            >
              <Phone size={20} />
            </a>
            <a
              href="mailto:glampingreservadelruiz@gmail.com"
              aria-label="Email"
              className="text-neutral-400 hover:text-[#F97316] transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>

        </div>

        {/* Map — full width, alone */}
        <div className="mt-10 overflow-hidden rounded-xl border border-neutral-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13581.706562354393!2d-75.44852697313321!3d4.980492210306577!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4763fe51655cab%3A0x6c68ba32b7d75b67!2sGlamping%20Reserva%20del%20Ruiz!5e0!3m2!1ses!2sco!4v1778360458509!5m2!1ses!2sco"
            width="100%"
            height="220"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Glamping Reserva del Ruiz"
          />
        </div>

        {/* Copyright + Legal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Glamping Reserva del Ruiz. {tFooter('copyright')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-neutral-500">
            {LEGAL_KEYS.map(({ key, href }, i) => (
              <React.Fragment key={href}>
                <Link href={href} className="hover:text-neutral-900 transition-colors">
                  {tFooter(`legal.${key}` as any)}
                </Link>
                {i < LEGAL_KEYS.length - 1 && (
                  <span className="text-neutral-300">|</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-neutral-300">|</span>
            <Link href="/login" className="hover:text-neutral-900 transition-colors">
              {tFooter('admin')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
