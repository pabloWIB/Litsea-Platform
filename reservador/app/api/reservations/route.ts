import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { ensureFolderPath, uploadFile } from '@/lib/google/drive'
import { createCalendarEvent, buildCalendarTitle, CALENDAR_COLORS } from '@/lib/google/calendar'
import { sendNewReservationEmail } from '@/lib/email'

const coerceNum = z.union([z.number(), z.string()]).transform(Number)

const schema = z.object({
  formData: z.object({
    clientName:      z.string().min(1),
    phone:           z.string().optional().default(''),
    planType:        z.string(),
    planPrice:       coerceNum,
    checkIn:         z.string(),
    checkOut:        z.string(),
    datos:           z.string().optional().default(''),
    additional:      z.string().optional().default(''),
    additionalCost:  coerceNum,
    discountPercent: coerceNum,
    discountAmount:  coerceNum,
    totalAmount:     coerceNum,
    paidAmount:      coerceNum,
    remainingBalance: coerceNum,
    notes:           z.string().optional().default(''),
  }),
  cardImageBase64: z.string().optional(),
  receipt: z.object({
    fileName:      z.string().min(1),
    mimeType:      z.string().min(1),
    contentBase64: z.string().min(1),
  }).nullable().optional(),
})

function fmtCOP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

function parsePlan(planType: string) {
  const parts = planType.split('|')
  return { name: parts[0] || planType, isFlat: parts[2] === 'flat' }
}

function nightsBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime()
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

function safeName(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, '').trim().slice(0, 120)
}

function norm(iso: string) {
  return iso.length === 16 ? `${iso}:00` : iso
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formData: fd, cardImageBase64, receipt } = schema.parse(body)

    const { name: planName, isFlat } = parsePlan(fd.planType)
    const nights        = isFlat ? 1 : nightsBetween(fd.checkIn, fd.checkOut)
    const price         = Number(fd.planPrice)
    const planCost      = isFlat ? price : price * nights
    const discountAmt   = Number(fd.discountAmount)
    const additionalCost = Number(fd.additionalCost)
    const total         = Number(fd.totalAmount)
    const paid          = Number(fd.paidAmount)
    const balance       = Number(fd.remainingBalance)

    // ── Drive folder ──────────────────────────────────────────────
    const checkIn = new Date(fd.checkIn)
    const year    = String(checkIn.getFullYear())
    const month   = String(checkIn.getMonth() + 1).padStart(2, '0')
    const folderLabel = `${year}-${month}-${String(checkIn.getDate()).padStart(2, '0')} ${safeName(fd.clientName)}`

    const folderId  = await ensureFolderPath([year, month, folderLabel])
    const folderLink = `https://drive.google.com/drive/folders/${folderId}`

    // Build summary text
    const lines: string[] = []
    lines.push(`RESERVA — ${fd.clientName}`)
    lines.push(`Plan: ${planName}`)
    lines.push(`Check-in:  ${fd.checkIn.replace('T', ' ')}`)
    lines.push(`Check-out: ${fd.checkOut.replace('T', ' ')}`)
    if (!isFlat) lines.push(`Noches: ${nights}`)
    lines.push('')
    lines.push('CLIENTE')
    lines.push(`Nombre: ${fd.clientName}`)
    if (fd.phone.trim()) lines.push(`Teléfono: ${fd.phone}`)
    if (fd.datos.trim()) { lines.push(''); lines.push('HUÉSPEDES'); lines.push(fd.datos.trim()) }
    lines.push('')
    lines.push('PRECIO')
    lines.push(`Precio ${isFlat ? 'del plan' : 'por noche'}: ${fmtCOP(price)}`)
    if (!isFlat) lines.push(`Subtotal plan: ${fmtCOP(planCost)} (${nights} noche${nights > 1 ? 's' : ''})`)
    if (Number(fd.discountPercent) > 0) lines.push(`Descuento ${fd.discountPercent}%: -${fmtCOP(discountAmt)}`)
    if (additionalCost > 0) {
      lines.push('')
      lines.push('ADICIONALES')
      const desc = fd.additional.trim()
      lines.push(desc ? `• ${desc}: ${fmtCOP(additionalCost)}` : `• Servicios adicionales: ${fmtCOP(additionalCost)}`)
    }
    lines.push('')
    lines.push(`TOTAL:  ${fmtCOP(total)}`)
    lines.push(`Pagado: ${fmtCOP(paid)}`)
    lines.push(`Saldo:  ${fmtCOP(balance)}`)
    if (fd.notes.trim()) { lines.push(''); lines.push('NOTAS INTERNAS'); lines.push(fd.notes.trim()) }
    const summaryText = lines.join('\n')

    // Upload summary .txt
    await uploadFile({
      parentId: folderId,
      fileName: `Resumen - ${folderLabel}.txt`,
      mimeType: 'text/plain',
      contentBase64: Buffer.from(summaryText, 'utf-8').toString('base64'),
    })

    // Upload card image
    let cardLink: string | undefined
    if (cardImageBase64) {
      const uploaded = await uploadFile({
        parentId: folderId,
        fileName: `Reserva - ${folderLabel}.jpg`,
        mimeType: 'image/jpeg',
        contentBase64: cardImageBase64,
      })
      cardLink = uploaded.webViewLink
    }

    // Upload receipt
    let receiptLink: string | undefined
    if (receipt) {
      const uploaded = await uploadFile({
        parentId: folderId,
        fileName: `Comprobante - ${receipt.fileName}`,
        mimeType: receipt.mimeType,
        contentBase64: receipt.contentBase64,
      })
      receiptLink = uploaded.webViewLink
    }

    // ── Calendar — 1-hour block on check-in date ──────────────────
    const eventStart = new Date(fd.checkIn)
    const eventEnd   = new Date(eventStart.getTime() + 60 * 60 * 1000)

    const eventTitle = buildCalendarTitle({
      clientName:       fd.clientName,
      phone:            fd.phone,
      paidAmount:       paid,
      planName,
      checkIn:          fd.checkIn,
      checkOut:         fd.checkOut,
      remainingBalance: balance,
    })

    const descriptionParts: string[] = []
    if (fd.datos.trim())      descriptionParts.push(fd.datos.trim())
    if (fd.additional.trim()) descriptionParts.push(`Adicionales: ${fd.additional.trim()}`)
    if (fd.notes.trim())      descriptionParts.push(`Notas: ${fd.notes.trim()}`)
    descriptionParts.push(`📁 Drive: ${folderLink}`)
    if (receiptLink) descriptionParts.push(`🧾 Comprobante: ${receiptLink}`)

    const event = await createCalendarEvent({
      summary:     eventTitle,
      description: descriptionParts.join('\n\n'),
      startISO:    eventStart.toISOString(),
      endISO:      eventEnd.toISOString(),
      location:    'Reserva del Ruiz — Vereda Montaño, Villamaría, Caldas',
      colorId:     CALENDAR_COLORS.confirmed,
    })

    // ── Supabase insert ───────────────────────────────────────────
    let reservationId: string | null = null
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data: row } = await supabase
        .from('reservations')
        .insert({
          client_name:       fd.clientName,
          phone:             fd.phone || null,
          client_email:      null,
          plan_name:         planName,
          plan_price:        price,
          is_flat:           isFlat,
          check_in:          norm(fd.checkIn),
          check_out:         norm(fd.checkOut),
          nights,
          guests_info:       fd.datos    || null,
          extra_description: fd.additional || null,
          extra_cost:        additionalCost,
          discount_percent:  Number(fd.discountPercent) || 0,
          discount_amount:   discountAmt,
          subtotal:          planCost - discountAmt,
          total_amount:      total,
          paid_amount:       paid,
          remaining_balance: balance,
          status:            'confirmed',
          notes:             fd.notes || null,
          drive_folder_id:   folderId,
          drive_folder_url:  folderLink,
          calendar_event_id: event.id || null,
          confirmation_sent_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      reservationId = row?.id ?? null
    } catch (dbErr) {
      console.error('[Supabase insert]', dbErr)
    }

    // ── Resend — notify owner ─────────────────────────────────────
    const ownerEmail = process.env.OWNER_EMAIL
    if (ownerEmail && process.env.RESEND_API_KEY) {
      sendNewReservationEmail(ownerEmail, {
        clientName:   fd.clientName,
        phone:        fd.phone,
        planName,
        checkIn:      fd.checkIn,
        checkOut:     fd.checkOut,
        nights,
        isFlat,
        total,
        paid,
        balance,
        driveLink:    folderLink,
        calendarLink: event.htmlLink ?? `https://calendar.google.com/calendar/r`,
        notes:        fd.notes || undefined,
        guestsInfo:   fd.datos || undefined,
      }).catch(e => console.error('[email:new-reservation]', e))
    }

    return NextResponse.json({
      ok: true,
      reservationId,
      driveFolderLink: folderLink,
      eventLink: event.htmlLink,
    })
  } catch (err) {
    console.error('[POST /api/reservations]', err)
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
