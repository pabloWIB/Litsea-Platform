import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import RegisterEmpleadorClient from '@/components/login/RegisterEmpleadorClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pageTitles' })
  return {
    title: t('registroEmpleador'),
    description: t('registroEmpleadorDesc'),
    robots: { index: false, follow: false },
  }
}

export default function RegisterEmpleadorPage() {
  return <RegisterEmpleadorClient />
}
