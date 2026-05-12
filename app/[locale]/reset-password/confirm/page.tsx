import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPasswordConfirmClient from '@/components/login/ResetPasswordConfirmClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nueva contraseña',
  robots: { index: false, follow: false },
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense>
      <ResetPasswordConfirmClient />
    </Suspense>
  )
}
