import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendCampaignEmails } from '@/lib/email'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { clients, subject, message } = await request.json()

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Asunto y mensaje son requeridos.' }, { status: 400 })
  }
  if (!Array.isArray(clients) || clients.length === 0) {
    return NextResponse.json({ error: 'Selecciona al menos un destinatario.' }, { status: 400 })
  }

  const valid = clients.filter((c: { name: string; email?: string }) =>
    c.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)
  ) as { name: string; email: string }[]

  if (valid.length === 0) {
    return NextResponse.json({ error: 'Ningún destinatario tiene email válido.' }, { status: 400 })
  }

  const result = await sendCampaignEmails(valid, subject.trim(), message.trim())
  return NextResponse.json({ ok: true, ...result })
}
