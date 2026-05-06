import type { Metadata } from 'next'
import ResetPasswordClient from '@/components/login/ResetPasswordClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Recuperar contraseña — Reserva del Ruiz',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
