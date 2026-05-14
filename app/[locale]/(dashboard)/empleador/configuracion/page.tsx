import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import EmpresaForm from './EmpresaForm'

export const metadata: Metadata = {
  title: 'Configuración — Litsea Empleos',
  robots: { index: false },
}

export type EmpresaData = {
  full_name: string
  company_name: string
  website: string
  description: string
}

export default async function EmpleadorConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: ep }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('employer_profiles').select('company_name, website, description').eq('user_id', user.id).single(),
  ])

  const initial: EmpresaData = {
    full_name:    profile?.full_name ?? '',
    company_name: ep?.company_name  ?? '',
    website:      ep?.website       ?? '',
    description:  ep?.description   ?? '',
  }

  async function saveEmpresa(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const full_name    = String(formData.get('full_name')    ?? '').trim()
    const company_name = String(formData.get('company_name') ?? '').trim()
    const website      = String(formData.get('website')      ?? '').trim()
    const description  = String(formData.get('description')  ?? '').trim()

    await Promise.all([
      supabase.from('profiles').update({ full_name }).eq('id', user.id),
      supabase.from('employer_profiles').update({ company_name, website: website || null, description: description || null }).eq('user_id', user.id),
    ])

    revalidatePath('/empleador/configuracion')
  }

  async function changePassword(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const newPassword = String(formData.get('new_password') ?? '').trim()
    if (newPassword.length < 8) return
    await supabase.auth.updateUser({ password: newPassword })
  }

  async function deleteAccount() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ is_active: false }).eq('id', user.id)
    await supabase.auth.signOut()
  }

  return (
    <div className="p-6 md:p-8 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Configuración</h1>
        <p className="text-sm text-neutral-500 mt-1">Información de tu empresa y cuenta.</p>
      </div>
      <EmpresaForm
        initial={initial}
        currentEmail={user.email ?? ''}
        onSaveEmpresa={saveEmpresa}
        onChangePassword={changePassword}
        onDeleteAccount={deleteAccount}
      />
    </div>
  )
}
