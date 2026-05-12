import type { Metadata } from 'next'
import LoginClient from '@/components/login/LoginClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Inicia sesión en Litsea Empleos para acceder a tu panel de terapeuta, empleador o administrador.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginClient />
}
