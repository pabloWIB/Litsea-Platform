import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendMonthlyReportEmail } from '@/lib/email'
import { ensureFolderPath, uploadFile } from '@/lib/google/drive'

function authOk(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function fmtCOP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

export async function POST(req: NextRequest) {
  if (!authOk(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ownerEmail = process.env.OWNER_EMAIL
  if (!ownerEmail) {
    return NextResponse.json({ error: 'OWNER_EMAIL not set' }, { status: 500 })
  }

  // Last month range
  const now        = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstOfLast  = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const monthLabel   = `${MONTH_NAMES[firstOfLast.getMonth()]} ${firstOfLast.getFullYear()}`

  const from = firstOfLast.toISOString()
  const to   = firstOfMonth.toISOString()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rows, error } = await supabase
    .from('reservations')
    .select('status,total_amount,paid_amount,remaining_balance,client_name,plan_name,check_in,check_out,nights,is_flat')
    .gte('created_at', from)
    .lt('created_at', to)

  if (error) {
    console.error('[cron:monthly-report] supabase error', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const all = rows ?? []

  const confirmedCount = all.filter(r => r.status === 'confirmed').length
  const completedCount = all.filter(r => r.status === 'completed').length
  const cancelledCount = all.filter(r => r.status === 'cancelled').length
  const pendingCount   = all.filter(r => r.status === 'pending').length

  const totalRevenue = all
    .filter(r => r.status !== 'cancelled')
    .reduce((s, r) => s + (r.total_amount ?? 0), 0)
  const totalPaid = all
    .filter(r => r.status !== 'cancelled')
    .reduce((s, r) => s + (r.paid_amount ?? 0), 0)
  const totalBalance = all
    .filter(r => r.status !== 'cancelled')
    .reduce((s, r) => s + (r.remaining_balance ?? 0), 0)

  // Build plain-text report for Drive
  const lines: string[] = [
    `REPORTE MENSUAL — ${monthLabel.toUpperCase()}`,
    `Generado: ${now.toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`,
    '',
    'RESUMEN',
    `Total reservas: ${all.length}`,
    `  Confirmadas:  ${confirmedCount}`,
    `  Pendientes:   ${pendingCount}`,
    `  Completadas:  ${completedCount}`,
    `  Canceladas:   ${cancelledCount}`,
    '',
    'FINANCIERO',
    `Total facturado: ${fmtCOP(totalRevenue)}`,
    `Total cobrado:   ${fmtCOP(totalPaid)}`,
    `Saldo pendiente: ${fmtCOP(totalBalance)}`,
    '',
    '─────────────────────────────────────────',
    'DETALLE DE RESERVAS',
    '',
  ]

  for (const r of all) {
    lines.push(
      `${r.client_name} — ${r.plan_name}`,
      `  Check-in:  ${r.check_in?.substring(0, 16)}`,
      `  Check-out: ${r.check_out?.substring(0, 16)}`,
      `  Estado:    ${r.status}`,
      `  Total:     ${fmtCOP(r.total_amount ?? 0)}  Pagado: ${fmtCOP(r.paid_amount ?? 0)}  Saldo: ${fmtCOP(r.remaining_balance ?? 0)}`,
      '',
    )
  }

  const reportText  = lines.join('\n')
  const year        = String(firstOfLast.getFullYear())
  const reportName  = `Reporte ${monthLabel}`

  // Upload report to Drive
  let driveLink: string | undefined
  try {
    const folderId = await ensureFolderPath([year, 'Reportes'])
    const uploaded = await uploadFile({
      parentId:      folderId,
      fileName:      `${reportName}.txt`,
      mimeType:      'text/plain',
      contentBase64: Buffer.from(reportText, 'utf-8').toString('base64'),
    })
    driveLink = uploaded.webViewLink ?? undefined
  } catch (e) {
    console.error('[cron:monthly-report] drive upload error', e)
  }

  // Send email
  await sendMonthlyReportEmail(ownerEmail, {
    monthLabel,
    totalCount:     all.length,
    confirmedCount,
    completedCount,
    cancelledCount,
    totalRevenue,
    totalPaid,
    totalBalance,
    driveLink,
  })

  return NextResponse.json({
    ok: true,
    monthLabel,
    totalCount: all.length,
    driveLink,
  })
}
