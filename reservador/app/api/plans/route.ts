import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const createSchema = z.object({
  name:       z.string().min(1),
  price:      z.number().positive(),
  is_flat:    z.boolean().default(false),
  active:     z.boolean().default(true),
  sort_order: z.number().int().default(0),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const fields = createSchema.parse(body)
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('plans')
      .insert(fields)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
