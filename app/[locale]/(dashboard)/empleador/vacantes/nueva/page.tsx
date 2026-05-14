import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import VacanteForm, { type VacanteFormData } from '@/components/vacantes/VacanteForm'

export const metadata: Metadata = {
  title: 'Nueva vacante — Litsea Empleos',
  robots: { index: false },
}

export default async function NuevaVacantePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let epId = ''
  try {
    const { data: ep } = await supabase
      .from('employer_profiles').select('id').eq('user_id', user.id).single()
    epId = ep?.id ?? ''
  } catch { }

  if (!epId) redirect('/empleador/dashboard')

  async function createVacante(data: VacanteFormData, publish: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: ep } = await supabase
      .from('employer_profiles').select('id').eq('user_id', user.id).single()
    if (!ep) return

    await supabase.from('vacancies').insert({
      employer_id:   ep.id,
      title:         data.title,
      description:   data.description,
      location:      data.location,
      position_type: data.position_type || 'Terapeuta',
      contract_type: data.contract_type,
      specialties:   data.specialties,
      is_active:     publish,
      is_featured:   false,
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/empleador/vacantes"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4">
          <ArrowLeft className="size-4" />
          Mis vacantes
        </Link>
        <h1 className="text-2xl font-black text-neutral-900">Publicar vacante</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Completa los datos de la oferta de trabajo.
        </p>
      </div>
      <VacanteForm action={createVacante} mode="create" />
    </div>
  )
}
