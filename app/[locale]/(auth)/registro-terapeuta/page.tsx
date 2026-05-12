import type { Metadata } from 'next'
import RegisterTerapeutaClient from '@/components/login/RegisterTerapeutaClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Registro de terapeuta',
  description: 'Crea tu cuenta como terapeuta egresado de Litsea y accede a vacantes en hoteles y spas de lujo en la Riviera Maya.',
  robots: { index: false, follow: false },
}

export default function RegisterTerapeutaPage() {
  return <RegisterTerapeutaClient />
}
