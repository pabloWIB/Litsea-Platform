import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const patchSchema = z.object({
  name:       z.string().min(1).optional(),
  price:      z.number().positive().optional(),
  is_flat:    z.boolean().optional(),
  active:     z.boolean().optional(),
  sort_order: z.number().int().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body   = await req.json()
    const fields = patchSchema.parse(body)
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('plans')
      .update(fields)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', params.id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
