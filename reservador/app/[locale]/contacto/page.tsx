import type { Metadata } from 'next'
import GlampingContactForm from '@/components/contacto/GlampingContactForm'

const BASE = 'https://glampingreservadelruiz.website'
const PATH = '/contacto'

const META = {
  es: {
    title: 'Contacto',
    description: 'Contáctanos por WhatsApp o formulario para reservar en Glamping Reserva del Ruiz, Villamaría, Caldas. Respondemos en minutos. +57 315 2779642.',
    ogLocale: 'es_CO',
  },
  en: {
    title: 'Contact',
    description: 'Contact Glamping Reserva del Ruiz by WhatsApp or form to book your stay near Manizales, Colombia. We respond in minutes. +57 315 2779642.',
    ogLocale: 'en_US',
  },
  fr: {
    title: 'Contact',
    description: 'Contactez Glamping Reserva del Ruiz par WhatsApp ou formulaire pour réserver près de Manizales, Colombie. Nous répondons en quelques minutes.',
    ogLocale: 'fr_FR',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const l = (['es', 'en', 'fr'].includes(locale) ? locale : 'es') as keyof typeof META
  const m = META[l]
  const url = l === 'es' ? `${BASE}${PATH}` : `${BASE}/${l}${PATH}`

  return {
    title: m.title,
    description: m.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        es: `${BASE}${PATH}`,
        en: `${BASE}/en${PATH}`,
        fr: `${BASE}/fr${PATH}`,
      },
    },
    openGraph: {
      title: `${m.title} — Glamping Reserva del Ruiz`,
      description: m.description,
      url,
      siteName: 'Glamping Reserva del Ruiz',
      images: [{ url: '/bienvenida-glamping.webp', width: 1200, height: 630, alt: 'Glamping Reserva del Ruiz' }],
      locale: m.ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${m.title} — Glamping Reserva del Ruiz`,
      description: m.description,
      images: ['/bienvenida-glamping.webp'],
    },
  }
}

export default function ContactoPage() {
  return <GlampingContactForm />
}
