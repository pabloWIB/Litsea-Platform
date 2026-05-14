import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import CuentaForm from './CuentaForm'

export const metadata: Metadata = {
  title: 'Configuración — Litsea Empleos',
  robots: { index: false },
}

export default async function TerapeutaConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('full_name, email').eq('id', user.id).single()

  async function changePassword(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const newPassword = String(formData.get('new_password') ?? '').trim()
    if (newPassword.length < 8) return
    await supabase.auth.updateUser({ password: newPassword })
  }

  async function changeEmail(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const newEmail = String(formData.get('new_email') ?? '').trim()
    if (!newEmail) return
    await supabase.auth.updateUser({ email: newEmail })
  }

  async function updateName(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const name = String(formData.get('full_name') ?? '').trim()
    if (!name) return
    await supabase.from('profiles').update({ full_name: name }).eq('id', user.id)
    revalidatePath('/terapeuta/configuracion')
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
        <p className="text-sm text-neutral-500 mt-1">Gestiona tu cuenta.</p>
      </div>
      <CuentaForm
        initialName={profile?.full_name ?? ''}
        currentEmail={user.email ?? ''}
        onChangeName={updateName}
        onChangePassword={changePassword}
        onChangeEmail={changeEmail}
        onDeleteAccount={deleteAccount}
      />
    </div>
  )
}
