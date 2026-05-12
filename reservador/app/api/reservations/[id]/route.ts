import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { updateCalendarEvent, buildCalendarTitle, CALENDAR_COLORS } from '@/lib/google/calendar'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const patchSchema = z.object({
  status:            z.enum(['confirmed', 'pending', 'cancelled', 'completed', 'postponed']).optional(),
  paid_amount:       z.number().optional(),
  remaining_balance: z.number().optional(),
  notes:             z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body   = await req.json()
    const fields = patchSchema.parse(body)
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('reservations')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Sync Calendar: update color (and title if postponed/un-postponed)
    if (fields.status && data.calendar_event_id) {
      try {
        const colorId = CALENDAR_COLORS[fields.status as keyof typeof CALENDAR_COLORS] ?? CALENDAR_COLORS.confirmed
        const title   = buildCalendarTitle({
          clientName:       data.client_name,
          phone:            data.phone,
          paidAmount:       data.paid_amount,
          planName:         data.plan_name,
          checkIn:          data.check_in,
          checkOut:         data.check_out,
          remainingBalance: data.remaining_balance,
          postponed:        fields.status === 'postponed',
        })
        await updateCalendarEvent(data.calendar_event_id, { colorId, summary: title })
      } catch (calErr) {
        console.error('[calendar:status-update]', calErr)
      }
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabase()

    const { data: reservation } = await supabase
      .from('reservations')
      .select('calendar_event_id')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    if (reservation?.calendar_event_id) {
      updateCalendarEvent(reservation.calendar_event_id, {
        colorId: CALENDAR_COLORS.cancelled,
      }).catch(e => console.error('[calendar:cancel]', e))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
