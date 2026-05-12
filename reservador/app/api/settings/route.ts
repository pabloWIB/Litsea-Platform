import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEFAULTS = {
  whatsapp_number:  '573152779642',
  whatsapp_message: 'Hola! Me gustaría consultar disponibilidad en Glamping Reserva del Ruiz.',
  contact_email:    'glampingreservadelruiz@gmail.com',
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  try {
    const { data, error } = await getSupabase()
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .single()

    if (error) return NextResponse.json({ ok: true, data: DEFAULTS, tableExists: false })
    return NextResponse.json({ ok: true, data, tableExists: true })
  } catch {
    return NextResponse.json({ ok: true, data: DEFAULTS, tableExists: false })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const allowed = ['whatsapp_number', 'whatsapp_message', 'contact_email']
    const fields: Record<string, string> = {}
    for (const key of allowed) {
      if (key in body) fields[key] = body[key]
    }

    const { data, error } = await getSupabase()
      .from('settings')
      .upsert({ id: 'main', ...fields, updated_at: new Date().toISOString() })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
