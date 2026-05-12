import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, location, body } = await request.json()

    if (!name?.trim() || !location?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'Nombre, ubicación y opinión son requeridos.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('reviews').insert({
      name:     name.trim(),
      location: location.trim(),
      body:     body.trim(),
    })

    if (error) throw error

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'No se pudo guardar la opinión.' }, { status: 500 })
  }
}
