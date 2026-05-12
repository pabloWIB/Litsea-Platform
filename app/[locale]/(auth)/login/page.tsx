import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import LoginSelectorClient from '@/components/login/LoginSelectorClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('login'),
    description: t('loginDesc'),
    robots: { index: false, follow: false },
  }
}

export default function LoginPage() {
  return <LoginSelectorClient />
}
