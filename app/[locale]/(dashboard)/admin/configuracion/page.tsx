import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import ConfigForm from './ConfigForm'

export const metadata: Metadata = {
  title: 'Configuración — Admin',
  robots: { index: false },
}

export type SiteConfig = {
  allow_registrations: boolean
  home_title: string
  home_subtitle: string
}

export default async function AdminConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let config: SiteConfig = {
    allow_registrations: true,
    home_title:          'Empleo de calidad para terapeutas certificados',
    home_subtitle:       'Conectamos a los mejores terapeutas de Litsea con hoteles y spas de la Riviera Maya.',
  }

  try {
    const { data: settings } = await supabase.from('settings').select('key, value')
    for (const s of settings ?? []) {
      if (s.key === 'allow_registrations') config.allow_registrations = Boolean(s.value)
      if (s.key === 'home_title')          config.home_title          = String(s.value)
      if (s.key === 'home_subtitle')       config.home_subtitle       = String(s.value)
    }
  } catch {  }

  async function saveConfig(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const allowReg    = formData.get('allow_registrations') === 'on'
    const homeTitle   = String(formData.get('home_title') ?? '').trim()
    const homeSub     = String(formData.get('home_subtitle') ?? '').trim()

    await Promise.all([
      supabase.from('settings').upsert({ key: 'allow_registrations', value: allowReg,  updated_by: user.id }),
      supabase.from('settings').upsert({ key: 'home_title',          value: homeTitle, updated_by: user.id }),
      supabase.from('settings').upsert({ key: 'home_subtitle',       value: homeSub,   updated_by: user.id }),
    ])

    await logAudit(user.id, 'update_setting', 'settings', 'site_config', {
      allow_registrations: allowReg,
      home_title:          homeTitle,
      home_subtitle:       homeSub,
    })

    revalidatePath('/admin/configuracion')
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500 mt-1">Ajustes globales de la plataforma.</p>
      </div>
      <ConfigForm initial={config} action={saveConfig} />
    </div>
  )
}
