import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM ?? 'Glamping Reserva del Ruiz <reservas@glampingreservadelruiz.website>'

function fmtCOP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

function fmtDate(iso: string) {
  return iso.replace('T', ' ').substring(0, 16)
}

const BASE_STYLE = `
  body{margin:0;padding:0;background:#FDFAF5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
`
const CARD = `max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e5e5;overflow:hidden;`

function header() {
  return `
    <tr>
      <td style="padding:28px 40px 20px;border-bottom:1px solid #f0f0f0;">
        <img src="https://glampingreservadelruiz.website/web-app-manifest-512x512-color.png"
          alt="Glamping Reserva del Ruiz" height="40" style="display:block;" />
      </td>
    </tr>`
}

function footer() {
  return `
    <tr>
      <td style="padding:18px 40px 24px;border-top:1px solid #f0f0f0;">
        <p style="margin:0;font-size:11px;color:#a3a3a3;">
          © 2026 Glamping Reserva del Ruiz ·
          <a href="https://glampingreservadelruiz.website" style="color:#a3a3a3;text-decoration:underline;">
            glampingreservadelruiz.website
          </a>
        </p>
      </td>
    </tr>`
}

function row(label: string, value: string, highlight = false) {
  return `
    <tr>
      <td style="padding:5px 0;font-size:13px;color:#737373;width:44%;">${label}</td>
      <td style="padding:5px 0;font-size:13px;font-weight:600;color:${highlight ? '#F97316' : '#0a0a0a'};">${value}</td>
    </tr>`
}

function btn(text: string, href: string) {
  return `
    <a href="${href}" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;
      font-size:13px;font-weight:600;padding:10px 22px;border-radius:8px;margin-right:10px;margin-top:4px;">
      ${text}
    </a>`
}

// ── 1. New reservation (owner) ────────────────────────────────────────────────

interface NewReservationData {
  clientName:      string
  phone:           string
  planName:        string
  checkIn:         string
  checkOut:        string
  nights:          number
  isFlat:          boolean
  total:           number
  paid:            number
  balance:         number
  driveLink:       string
  calendarLink:    string
  notes?:          string
  guestsInfo?:     string
}

export async function sendNewReservationEmail(to: string, d: NewReservationData) {
  const subject = `🏕️ Nueva reserva — ${d.clientName}`

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>${BASE_STYLE}</style></head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="${CARD}">
          ${header()}
          <tr>
            <td style="padding:32px 40px 28px;">
              <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.3px;">
                Nueva reserva confirmada
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#737373;line-height:1.5;">
                Se acaba de registrar una nueva reserva en el sistema.
              </p>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0f0f0;border-radius:10px;padding:2px 20px;margin-bottom:24px;">
                <tr><td style="padding:16px 0 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('Cliente',    d.clientName)}
                    ${d.phone ? row('Teléfono', d.phone) : ''}
                    ${row('Plan',       d.planName)}
                    ${row('Check-in',   fmtDate(d.checkIn))}
                    ${row('Check-out',  fmtDate(d.checkOut))}
                    ${!d.isFlat ? row('Noches', String(d.nights)) : ''}
                    ${d.guestsInfo ? row('Huéspedes', d.guestsInfo) : ''}
                  </table>
                </td></tr>
              </table>

              <!-- Financial summary -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#FDFAF5;border-radius:10px;padding:2px 20px;margin-bottom:28px;">
                <tr><td style="padding:16px 0 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('Total',   fmtCOP(d.total))}
                    ${row('Pagado',  fmtCOP(d.paid))}
                    ${row('Saldo',   fmtCOP(d.balance), d.balance > 0)}
                  </table>
                </td></tr>
              </table>

              ${d.notes ? `
                <p style="margin:0 0 20px;font-size:12px;color:#737373;background:#f5f5f5;
                  border-radius:8px;padding:12px 16px;line-height:1.6;">
                  <strong>Notas:</strong> ${d.notes}
                </p>` : ''}

              <!-- CTAs -->
              <div>
                ${btn('Ver en Drive', d.driveLink)}
                ${btn('Ver en Calendar', d.calendarLink)}
              </div>
            </td>
          </tr>
          ${footer()}
        </table>
      </td></tr>
    </table>
  </body></html>`

  return resend.emails.send({ from: FROM, to, subject, html })
}

// ── 2. Arrival reminder (owner) ───────────────────────────────────────────────

interface ReminderData {
  clientName: string
  planName:   string
  checkIn:    string
  checkOut:   string
  nights:     number
  isFlat:     boolean
  balance:    number
  driveLink:  string
  when:       'today' | 'tomorrow'
}

export async function sendReminderEmail(to: string, d: ReminderData) {
  const whenLabel = d.when === 'today' ? 'HOY' : 'MAÑANA'
  const subject   = `🛎️ ${whenLabel} llega ${d.clientName}`

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>${BASE_STYLE}</style></head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="${CARD}">
          ${header()}
          <tr>
            <td style="padding:32px 40px 28px;">
              <div style="display:inline-block;background:#FFF7ED;color:#F97316;font-size:12px;
                font-weight:700;padding:5px 12px;border-radius:20px;margin-bottom:16px;letter-spacing:0.5px;">
                RECORDATORIO — ${whenLabel}
              </div>
              <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.3px;">
                Llega ${d.clientName}
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#737373;">
                ${d.when === 'today'
                  ? 'El cliente llega hoy. Asegúrate de que el glamping esté listo.'
                  : 'El cliente llega mañana. Revisa que todo esté preparado.'}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0f0f0;border-radius:10px;padding:2px 20px;margin-bottom:24px;">
                <tr><td style="padding:16px 0 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('Plan',       d.planName)}
                    ${row('Check-in',   fmtDate(d.checkIn))}
                    ${row('Check-out',  fmtDate(d.checkOut))}
                    ${!d.isFlat ? row('Noches', String(d.nights)) : ''}
                    ${d.balance > 0 ? row('Saldo pendiente', fmtCOP(d.balance), true) : row('Saldo', 'Sin saldo')}
                  </table>
                </td></tr>
              </table>

              ${btn('Abrir carpeta en Drive', d.driveLink)}
            </td>
          </tr>
          ${footer()}
        </table>
      </td></tr>
    </table>
  </body></html>`

  return resend.emails.send({ from: FROM, to, subject, html })
}

// ── 3. Campaign email (to clients) ───────────────────────────────────────────

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function sendCampaignEmails(
  recipients: { name: string; email: string }[],
  subject: string,
  message: string
): Promise<{ sent: number; failed: number }> {
  const bodyHtml = escapeHtml(message).replace(/\n/g, '<br>')

  const emails = recipients.map(r => ({
    from:    FROM,
    to:      r.email,
    subject,
    html: `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <style>${BASE_STYLE}</style></head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
        <tr><td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="${CARD}">
            ${header()}
            <tr>
              <td style="padding:32px 40px 28px;">
                <p style="margin:0 0 16px;font-size:15px;color:#0a0a0a;">Hola ${escapeHtml(r.name)},</p>
                <div style="font-size:14px;color:#404040;line-height:1.7;">${bodyHtml}</div>
                <p style="margin:28px 0 0;font-size:13px;color:#737373;">
                  Con cariño,<br/>
                  <strong style="color:#0a0a0a;">Glamping Reserva del Ruiz</strong>
                </p>
              </td>
            </tr>
            ${footer()}
          </table>
        </td></tr>
      </table>
    </body></html>`,
  }))

  let sent = 0
  let failed = 0
  for (let i = 0; i < emails.length; i += 100) {
    try {
      await resend.batch.send(emails.slice(i, i + 100))
      sent += Math.min(100, emails.length - i)
    } catch {
      failed += Math.min(100, emails.length - i)
    }
  }
  return { sent, failed }
}

// ── 4. Monthly report (owner) ─────────────────────────────────────────────────

interface MonthlyReportData {
  monthLabel:     string   // e.g. "Abril 2026"
  totalCount:     number
  confirmedCount: number
  completedCount: number
  cancelledCount: number
  totalRevenue:   number
  totalPaid:      number
  totalBalance:   number
  driveLink?:     string
}

export async function sendMonthlyReportEmail(to: string, d: MonthlyReportData) {
  const subject = `📊 Reporte mensual — ${d.monthLabel}`

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>${BASE_STYLE}</style></head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="${CARD}">
          ${header()}
          <tr>
            <td style="padding:32px 40px 28px;">
              <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.3px;">
                Reporte mensual — ${d.monthLabel}
              </h1>
              <p style="margin:0 0 28px;font-size:14px;color:#737373;">
                Resumen de reservas del mes pasado.
              </p>

              <!-- Stat boxes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="48%" style="padding:0 4px 0 0;">
                    <div style="background:#FFF7ED;border-radius:10px;padding:18px;text-align:center;">
                      <div style="font-size:28px;font-weight:800;color:#F97316;">${d.totalCount}</div>
                      <div style="font-size:11px;color:#737373;margin-top:2px;">Reservas totales</div>
                    </div>
                  </td>
                  <td width="48%" style="padding:0 0 0 4px;">
                    <div style="background:#FDFAF5;border:1px solid #f0f0f0;border-radius:10px;padding:18px;text-align:center;">
                      <div style="font-size:28px;font-weight:800;color:#0a0a0a;">${fmtCOP(d.totalRevenue)}</div>
                      <div style="font-size:11px;color:#737373;margin-top:2px;">Ingresos totales</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Detail table -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #f0f0f0;border-radius:10px;padding:2px 20px;margin-bottom:28px;">
                <tr><td style="padding:16px 0 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${row('Confirmadas',  String(d.confirmedCount))}
                    ${row('Completadas',  String(d.completedCount))}
                    ${row('Canceladas',   String(d.cancelledCount))}
                    ${row('Total cobrado', fmtCOP(d.totalPaid))}
                    ${row('Saldo pendiente', fmtCOP(d.totalBalance), d.totalBalance > 0)}
                  </table>
                </td></tr>
              </table>

              ${d.driveLink ? btn('Ver en Drive', d.driveLink) : ''}
            </td>
          </tr>
          ${footer()}
        </table>
      </td></tr>
    </table>
  </body></html>`

  return resend.emails.send({ from: FROM, to, subject, html })
}
