import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAudit } from '@/lib/audit'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403 })

  const body = await request.json().catch(() => null)
  const { status } = body ?? {}
  if (!['approved', 'rejected', 'pending'].includes(status))
    return new Response('Status inválido', { status: 400 })

  const service = createServiceClient()
  await service.from('opiniones').update({
    status,
    revisado_by: user.id,
    revisado_at: new Date().toISOString(),
  }).eq('id', id)

  const action = status === 'approved' ? 'approve_opinion'
    : status === 'rejected' ? 'reject_opinion'
    : 'reconsider_opinion'

  await logAudit(user.id, action, 'opiniones', id)

  return NextResponse.json({ ok: true })
}
