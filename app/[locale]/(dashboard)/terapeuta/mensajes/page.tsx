import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatContainer, { type ConvSummary } from '@/components/mensajes/ChatContainer'

export const metadata: Metadata = {
  title: 'Mensajes — Litsea Empleos',
  robots: { index: false },
}

export default async function TerapeutaMensajesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let conversations: ConvSummary[] = []

  try {
    const { data: convRows } = await supabase
      .from('conversations')
      .select('id, employer_id, application_id')
      .eq('therapist_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (convRows?.length) {
      const employerIds  = [...new Set(convRows.map(c => c.employer_id))]
      const applicationIds = convRows.map(c => c.application_id)

      const [profilesRes, appsRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url').in('id', employerIds),
        supabase.from('applications')
          .select('id, vacancies(title)')
          .in('id', applicationIds),
      ])

      const profileMap = Object.fromEntries(
        (profilesRes.data ?? []).map(p => [p.id, p]),
      )
      const appMap = Object.fromEntries(
        (appsRes.data ?? []).map(a => {
          const v = Array.isArray(a.vacancies) ? a.vacancies[0] : a.vacancies
          return [a.id, v?.title ?? 'Vacante']
        }),
      )

      conversations = convRows.map(c => ({
        id:           c.id,
        otherName:    profileMap[c.employer_id]?.full_name ?? 'Empresa',
        otherAvatar:  profileMap[c.employer_id]?.avatar_url ?? null,
        vacancyTitle: appMap[c.application_id] ?? 'Vacante',
      }))
    }
  } catch { }

  return (
    <div className="h-[calc(100vh-56px)] md:h-full overflow-hidden">
      <ChatContainer
        conversations={conversations}
        currentUserId={user.id}
        emptyDescription="Las conversaciones aparecen cuando Litsea habilita el chat con un empleador interesado en tu perfil."
      />
    </div>
  )
}
