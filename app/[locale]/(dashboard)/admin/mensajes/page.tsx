import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/audit'
import { MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mensajes — Admin',
  robots: { index: false },
}

type ConvRow = {
  id: string
  is_active: boolean
  created_at: string
  therapist_name: string
  employer_name: string
  vacancy_title: string
  last_body: string | null
  last_at: string | null
  message_count: number
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}

export default async function AdminMensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ conv?: string }>
}) {
  const { conv: selectedId } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  let conversations: ConvRow[] = []
  let messages: { id: string; body: string; sender_name: string; created_at: string; is_admin: boolean }[] = []

  try {
    const { data: convs } = await supabase
      .from('conversations')
      .select(`
        id, is_active, created_at,
        application:applications!application_id(vacancy:vacancies!vacancy_id(title)),
        therapist:therapist_profiles!therapist_id(profiles!user_id(full_name)),
        employer:employer_profiles!employer_id(company_name),
        messages(id, body, created_at)
      `)
      .order('created_at', { ascending: false })

    conversations = (convs ?? []).map((c: any) => {
      const application = Array.isArray(c.application) ? c.application[0] : c.application
      const vacancy = Array.isArray(application?.vacancy) ? application?.vacancy[0] : application?.vacancy
      const therapist = Array.isArray(c.therapist) ? c.therapist[0] : c.therapist
      const pr = Array.isArray(therapist?.profiles) ? therapist?.profiles[0] : therapist?.profiles
      const employer = Array.isArray(c.employer) ? c.employer[0] : c.employer
      const msgs: any[] = Array.isArray(c.messages) ? c.messages : []
      const last = msgs.sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))[0]
      return {
        id:             c.id,
        is_active:      c.is_active,
        created_at:     c.created_at,
        therapist_name: pr?.full_name ?? 'Terapeuta',
        employer_name:  employer?.company_name ?? 'Empresa',
        vacancy_title:  vacancy?.title ?? 'Vacante',
        last_body:      last?.body ?? null,
        last_at:        last?.created_at ?? null,
        message_count:  msgs.length,
      }
    })

    if (selectedId) {
      const { data: msgs } = await supabase
        .from('messages')
        .select(`id, body, created_at, sender_id, profiles!sender_id(full_name, role)`)
        .eq('conversation_id', selectedId)
        .order('created_at', { ascending: true })

      messages = (msgs ?? []).map((m: any) => {
        const pr = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
        return {
          id:          m.id,
          body:        m.body,
          sender_name: pr?.full_name ?? 'Usuario',
          created_at:  m.created_at,
          is_admin:    pr?.role === 'admin',
        }
      })
    }
  } catch {  }

  async function toggleConversation(convId: string, currentlyActive: boolean) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('conversations').update({ is_active: !currentlyActive }).eq('id', convId)
    await logAudit(user.id, currentlyActive ? 'deactivate_chat' : 'reactivate_chat', 'mensajes', convId)
    revalidatePath('/admin/mensajes')
  }

  const selectedConv = conversations.find(c => c.id === selectedId)

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-neutral-900">Mensajes</h1>
        <p className="text-sm text-neutral-500 mt-1">Vista de solo lectura. {conversations.length} conversacion{conversations.length !== 1 ? 'es' : ''}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="size-8 text-neutral-300 mb-2" />
              <p className="text-sm text-neutral-500">No hay conversaciones.</p>
            </div>
          ) : (
            conversations.map(conv => (
              <a key={conv.id}
                href={`/admin/mensajes?conv=${conv.id}`}
                className={`block rounded-xl border p-3 transition-colors ${
                  selectedId === conv.id
                    ? 'border-[#2FB7A3] bg-[#2FB7A3]/5'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-bold text-neutral-800 truncate">{conv.therapist_name}</p>
                  <span className={`shrink-0 size-2 rounded-full ml-2 ${conv.is_active ? 'bg-[#2FB7A3]' : 'bg-neutral-300'}`} />
                </div>
                <p className="text-[11px] text-neutral-500 truncate">{conv.employer_name} · {conv.vacancy_title}</p>
                {conv.last_body && (
                  <p className="text-[11px] text-neutral-400 truncate mt-1">{conv.last_body}</p>
                )}
                <p className="text-[10px] text-neutral-300 mt-1">{conv.message_count} mensajes</p>
              </a>
            ))
          )}
        </div>

        <div className="md:col-span-2">
          {!selectedId || !selectedConv ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-neutral-200 bg-neutral-50 text-center">
              <MessageCircle className="size-8 text-neutral-300 mb-2" />
              <p className="text-sm text-neutral-500">Selecciona una conversación para ver los mensajes.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden flex flex-col">
              <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50">
                <p className="text-sm font-bold text-neutral-900">{selectedConv.therapist_name} ↔ {selectedConv.employer_name}</p>
                <p className="text-xs text-neutral-400">{selectedConv.vacancy_title}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-64 max-h-[480px]">
                {messages.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-8">Sin mensajes aún.</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-700">{msg.sender_name}</span>
                        <span className="text-[10px] text-neutral-400">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="text-sm text-neutral-800 bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 inline-block max-w-prose">
                        {msg.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="px-5 py-2 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                <p className="text-[11px] text-neutral-400">Vista de solo lectura</p>
                <form action={toggleConversation.bind(null, selectedConv.id, selectedConv.is_active)}>
                  <button type="submit"
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors ${
                      selectedConv.is_active
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-[#2FB7A3]/30 text-[#2FB7A3] hover:bg-[#2FB7A3]/5'
                    }`}>
                    {selectedConv.is_active ? 'Desactivar chat' : 'Reactivar chat'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
