import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { listCalendarEvents } from '@/lib/google/calendar'

const TOTAL_DOMES = 4

function datesBetween(start: string, end: string): string[] {
  const dates: string[] = []
  const current = new Date(start)
  const last = new Date(end)
  while (current <= last) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

function eventDate(event: { start?: { dateTime?: string | null; date?: string | null } | null }): string | null {
  const raw = event.start?.dateTime ?? event.start?.date
  if (!raw) return null
  return raw.split('T')[0]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end   = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Params start and end are required (YYYY-MM-DD)' },
      { status: 400 }
    )
  }

  // Count reservations per day from Google Calendar
  const occupiedByDay: Record<string, number> = {}
  try {
    const events = await listCalendarEvents(start, end)
    for (const event of events) {
      const day = eventDate(event)
      if (day) occupiedByDay[day] = (occupiedByDay[day] ?? 0) + 1
    }
  } catch (err) {
    console.error('[availability] Calendar error:', err)
    return NextResponse.json({ error: 'Error consultando Google Calendar' }, { status: 500 })
  }

  // Overlay manual blocked dates from Supabase (optional table)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: blocked } = await supabase
      .from('blocked_dates')
      .select('date')
      .gte('date', start)
      .lte('date', end)

    if (blocked) {
      for (const row of blocked) {
        occupiedByDay[row.date] = TOTAL_DOMES
      }
    }
  } catch {
    // blocked_dates table may not exist yet — not fatal
  }

  // Build response for every day in range
  const allDays = datesBetween(start, end)
  const result: Record<string, { occupied: number; available: number }> = {}
  for (const day of allDays) {
    const occupied = occupiedByDay[day] ?? 0
    result[day] = {
      occupied,
      available: Math.max(0, TOTAL_DOMES - occupied),
    }
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
