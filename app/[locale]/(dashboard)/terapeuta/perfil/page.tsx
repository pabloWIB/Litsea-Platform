import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PerfilWizard from '@/components/terapeuta/PerfilWizard'

export const metadata: Metadata = {
  title: 'Mi perfil — Litsea Empleos',
  robots: { index: false },
}

export default async function TerapeutaPerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let fullName  = ''
  let avatarUrl: string | null = null
  let tpId      = ''
  let slug: string | null = null
  let specialties: string[] = []
  let zones:       string[] = []
  let bio         = ''
  let expYears    = 0
  let isLitseaGrad = false

  try {
    const [profileRes, tpRes] = await Promise.all([
      supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
      supabase.from('therapist_profiles')
        .select('id, slug, specialties, zones, bio, experience_years, is_litsea_grad')
        .eq('user_id', user.id)
        .single(),
    ])

    fullName  = profileRes.data?.full_name ?? ''
    avatarUrl = profileRes.data?.avatar_url ?? null

    if (tpRes.data) {
      tpId         = tpRes.data.id
      slug         = tpRes.data.slug
      specialties  = tpRes.data.specialties ?? []
      zones        = tpRes.data.zones ?? []
      bio          = tpRes.data.bio ?? ''
      expYears     = tpRes.data.experience_years ?? 0
      isLitseaGrad = tpRes.data.is_litsea_grad ?? false
    }
  } catch {
  }

  if (!tpId) redirect('/terapeuta/dashboard')

  return (
    <PerfilWizard
      userId={user.id}
      tpId={tpId}
      fullName={fullName}
      currentSlug={slug}
      initial={{ avatar_url: avatarUrl, specialties, is_litsea_grad: isLitseaGrad, zones, bio, experience_years: expYears }}
    />
  )
}
