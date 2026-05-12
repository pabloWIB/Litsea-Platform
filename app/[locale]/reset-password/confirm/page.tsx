import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import ResetPasswordConfirmClient from '@/components/login/ResetPasswordConfirmClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('nuevaContrasena'),
    robots: { index: false, follow: false },
  }
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense>
      <ResetPasswordConfirmClient />
    </Suspense>
  )
}
