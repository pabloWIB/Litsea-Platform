import type { Metadata } from 'next'
import VacantesPageClient from '@/components/vacantes/VacantesPageClient'

export const metadata: Metadata = {
  title: 'Vacantes — Litsea Empleos',
  description: 'Encuentra vacantes en hoteles y spas de lujo de la Riviera Maya. Posiciones para terapeutas certificados en Cancún, Playa del Carmen y Tulum.',
  keywords: [
    'vacantes terapeuta Riviera Maya',
    'empleo spa Cancún',
    'trabajo terapeuta certificado',
    'bolsa de trabajo terapeutas México',
  ],
}

export default function VacantesPage() {
  return <VacantesPageClient />
}
