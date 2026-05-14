import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import VacanteForm, { type VacanteFormData } from '@/components/vacantes/VacanteForm'

export const metadata: Metadata = {
  title: 'Editar vacante — Litsea Empleos',
  robots: { index: false },
}

export default async function EditarVacantePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let vacancy: VacanteFormData | null = null

  try {
    const { data } = await supabase
      .from('vacancies')
      .select(`
        id, title, description, location, position_type, contract_type, specialties,
        employer_profiles!inner(user_id)
      `)
      .eq('id', id)
      .single()

    const ep = Array.isArray(data?.employer_profiles)
      ? data?.employer_profiles[0]
      : data?.employer_profiles

    if (!data || ep?.user_id !== user.id) return notFound()

    vacancy = {
      title:         data.title,
      description:   data.description,
      location:      data.location,
      position_type: data.position_type,
      contract_type: data.contract_type,
      specialties:   data.specialties,
    }
  } catch { notFound() }

  if (!vacancy) notFound()

  async function updateVacante(data: VacanteFormData, _publish: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('vacancies').update({
      title:         data.title,
      description:   data.description,
      location:      data.location,
      position_type: data.position_type || 'Terapeuta',
      contract_type: data.contract_type,
      specialties:   data.specialties,
    }).eq('id', id)
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/empleador/vacantes"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-4">
          <ArrowLeft className="size-4" />
          Mis vacantes
        </Link>
        <h1 className="text-2xl font-black text-neutral-900">Editar vacante</h1>
        <p className="text-sm text-neutral-500 mt-1">Modifica los datos de la oferta.</p>
      </div>
      <VacanteForm action={updateVacante} initial={vacancy} mode="edit" />
    </div>
  )
}
