import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('opiniones')
    .select('id, nombre, cargo, empresa, contenido, rating, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(12)

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return new Response('Invalid JSON', { status: 400 })

  const { nombre, email, cargo, empresa, contenido, rating } = body

  if (!nombre?.trim()) return new Response('Nombre requerido', { status: 400 })
  if (!email?.includes('@')) return new Response('Email inválido', { status: 400 })
  if (!contenido || contenido.length < 20) return new Response('Opinión muy corta', { status: 400 })
  if (contenido.length > 300) return new Response('Opinión muy larga', { status: 400 })
  if (!rating || rating < 1 || rating > 5) return new Response('Rating inválido', { status: 400 })

  const supabase = createServiceClient()
  const normalizedEmail = email.toLowerCase().trim()

  const { count } = await supabase
    .from('opiniones')
    .select('*', { count: 'exact', head: true })
    .eq('email', normalizedEmail)
    .gte('created_at', new Date(Date.now() - 86_400_000).toISOString())

  if (count && count > 0)
    return new Response('Ya enviaste una opinión en las últimas 24 horas.', { status: 429 })

  const { error } = await supabase.from('opiniones').insert({
    nombre:   nombre.trim(),
    email:    normalizedEmail,
    cargo:    cargo?.trim() || null,
    empresa:  empresa?.trim() || null,
    contenido: contenido.trim(),
    rating:   Number(rating),
    status:   'pending',
  })

  if (error) return new Response('Error al guardar', { status: 500 })

  return NextResponse.json({ ok: true })
}
