import type { Metadata } from 'next'
import LoginClient from '@/components/login/LoginClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Reserva del Ruiz',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginClient />
}
