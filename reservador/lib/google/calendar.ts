import { google } from 'googleapis'
import { getAuthClient } from './auth'

// Google Calendar color IDs by reservation status
export const CALENDAR_COLORS = {
  confirmed:  '7',  // Peacock — cyan/turquoise
  pending:    '5',  // Banana  — yellow
  postponed:  '11', // Tomato  — red
  cancelled:  '11', // Tomato  — red
  completed:  '8',  // Graphite
} as const

const DAYS_ES   = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function parseTimePart(iso: string): string {
  const timePart = iso.split('T')[1] || ''
  const [hStr, mStr] = timePart.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  const period = h < 12 ? 'am' : 'pm'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2, '0')} ${period}`
}

function parseDateParts(iso: string) {
  const [datePart] = iso.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return {
    dayOfWeek: DAYS_ES[d.getUTCDay()],
    day:       d.getUTCDate(),
    month:     MONTHS_ES[d.getUTCMonth()],
    time:      parseTimePart(iso),
  }
}

export function buildCalendarTitle(params: {
  clientName:       string
  phone:            string | null
  paidAmount:       number
  planName:         string
  checkIn:          string
  checkOut:         string
  remainingBalance: number
  postponed?:       boolean
}): string {
  const paid  = Math.round(params.paidAmount).toLocaleString('es-CO')
  const ci    = parseDateParts(params.checkIn)
  const co    = parseDateParts(params.checkOut)
  const phone = params.phone?.trim() ? ` ${params.phone.trim()}` : ''
  const sameDay = params.checkIn.split('T')[0] === params.checkOut.split('T')[0]

  let title = `${params.clientName}${phone} pagó ${paid} de ${params.planName} para el día ${ci.dayOfWeek} ${ci.day} de ${ci.month} desde las ${ci.time}`

  if (sameDay) {
    title += ` hasta las ${co.time}`
  } else {
    title += ` hasta el día ${co.dayOfWeek} ${co.day} de ${co.month} a las ${co.time}`
  }

  if (params.remainingBalance > 0) {
    title += `. Faltan ${Math.round(params.remainingBalance).toLocaleString('es-CO')}`
  }

  return params.postponed ? `APLAZADA — ${title}` : title
}

export async function listCalendarEvents(startDate: string, endDate: string) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
  const calendar = google.calendar({ version: 'v3', auth: getAuthClient() })

  const res = await calendar.events.list({
    calendarId,
    timeMin: new Date(startDate).toISOString(),
    timeMax: new Date(endDate + 'T23:59:59').toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 500,
  })

  return res.data.items ?? []
}

export async function createCalendarEvent(params: {
  summary:     string
  description: string
  startISO:    string
  endISO:      string
  location?:   string
  colorId?:    string
}): Promise<{ id: string; htmlLink?: string }> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
  const calendar = google.calendar({ version: 'v3', auth: getAuthClient() })

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary:     params.summary,
      description: params.description,
      location:    params.location,
      colorId:     params.colorId,
      start: { dateTime: params.startISO, timeZone: 'America/Bogota' },
      end:   { dateTime: params.endISO,   timeZone: 'America/Bogota' },
    },
  })

  return { id: res.data.id!, htmlLink: res.data.htmlLink ?? undefined }
}

export async function updateCalendarEvent(
  eventId: string,
  updates: { colorId?: string; summary?: string }
): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'
  const calendar = google.calendar({ version: 'v3', auth: getAuthClient() })

  const requestBody: Record<string, unknown> = {}
  if (updates.colorId !== undefined) requestBody.colorId = updates.colorId
  if (updates.summary !== undefined) requestBody.summary = updates.summary

  await calendar.events.patch({ calendarId, eventId, requestBody })
}
