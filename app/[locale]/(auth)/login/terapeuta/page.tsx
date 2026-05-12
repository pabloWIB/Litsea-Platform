import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoginClient from '@/components/login/LoginClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('loginTerapeuta'),
    robots: { index: false, follow: false },
  }
}

export default function LoginTerapeutaPage() {
  return <LoginClient variant="terapeuta" />
}
