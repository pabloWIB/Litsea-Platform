import type { Metadata } from 'next'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
import ResetPasswordConfirmClient from '@/components/login/ResetPasswordConfirmClient'

export const metadata: Metadata = {
  title: 'Nueva contraseña — Reserva del Ruiz',
  robots: { index: false, follow: false },
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense>
      <ResetPasswordConfirmClient />
    </Suspense>
  )
}
