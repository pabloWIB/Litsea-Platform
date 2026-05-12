import type { Metadata } from 'next'
import RegisterEmpleadorClient from '@/components/login/RegisterEmpleadorClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Registro de empleador',
  description: 'Crea tu cuenta como hotel o spa y publica vacantes para terapeutas certificados por Litsea Centro de Capacitación.',
  robots: { index: false, follow: false },
}

export default function RegisterEmpleadorPage() {
  return <RegisterEmpleadorClient />
}
