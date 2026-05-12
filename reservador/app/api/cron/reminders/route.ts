import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendReminderEmail } from '@/lib/email'

function authOk(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

function todayISO() {
  return new Date().toISOString().substring(0, 10)
}

function tomorrowISO() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().substring(0, 10)
}

export async function POST(req: NextRequest) {
  if (!authOk(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const ownerEmail = process.env.OWNER_EMAIL
  if (!ownerEmail) {
    return NextResponse.json({ error: 'OWNER_EMAIL not set' }, { status: 500 })
  }

  const today    = todayISO()
  const tomorrow = tomorrowISO()

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('client_name,plan_name,check_in,check_out,nights,is_flat,remaining_balance,drive_folder_url')
    .in('status', ['confirmed', 'pending'])
    .or(`check_in.gte.${today}T00:00:00,check_in.lte.${tomorrow}T23:59:59`)

  if (error) {
    console.error('[cron:reminders] supabase error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sent: string[] = []
  const errors: string[] = []

  for (const r of reservations ?? []) {
    const checkInDate = r.check_in.substring(0, 10)
    const when: 'today' | 'tomorrow' | null =
      checkInDate === today    ? 'today'    :
      checkInDate === tomorrow ? 'tomorrow' : null

    if (!when) continue

    try {
      await sendReminderEmail(ownerEmail, {
        clientName: r.client_name,
        planName:   r.plan_name,
        checkIn:    r.check_in,
        checkOut:   r.check_out,
        nights:     r.nights ?? 1,
        isFlat:     r.is_flat ?? false,
        balance:    r.remaining_balance ?? 0,
        driveLink:  r.drive_folder_url ?? 'https://drive.google.com',
        when,
      })
      sent.push(`${r.client_name} (${when})`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`${r.client_name}: ${msg}`)
      console.error('[cron:reminders] email error', e)
    }
  }

  return NextResponse.json({ ok: true, sent, errors })
}
