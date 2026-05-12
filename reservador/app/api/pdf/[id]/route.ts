import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ReservationDocument } from './document'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !reservation) {
    return new NextResponse('Reserva no encontrada', { status: 404 })
  }

  const logoPath = path.join(process.cwd(), 'public', 'web-app-manifest-512x512.png')
  const logo = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    createElement(ReservationDocument, { reservation, logo }) as any
  )

  const slug = reservation.client_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const filename = `reserva-${slug}-${reservation.id.slice(0, 6)}.pdf`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
