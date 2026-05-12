import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const { date, reason } = await request.json()
    if (!date) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

    const { data, error } = await supabase
      .from('blocked_dates')
      .insert({ date, reason: reason?.trim() || null })
      .select('id, date, reason')
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'No se pudo bloquear la fecha' }, { status: 500 })
  }
}
