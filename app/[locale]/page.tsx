import type { Metadata } from 'next'
import HomeClient from '@/components/home/HomeClient'

export const metadata: Metadata = {
  title: 'Litsea Empleos — Bolsa de trabajo para terapeutas certificados',
  description:
    'Conectamos terapeutas egresados de Litsea Centro de Capacitación con hoteles y spas de lujo en la Riviera Maya. Vacantes verificadas en Cancún, Playa del Carmen y Tulum.',
}

export default function HomePage() {
  return <HomeClient />
}
