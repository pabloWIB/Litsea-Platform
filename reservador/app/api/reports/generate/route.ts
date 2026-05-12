import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as sb } from '@supabase/supabase-js'
import { ensureFolderPath, uploadFile } from '@/lib/google/drive'

const MONTH_NAMES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function fmtCOP(n: number) {
  return `$${Math.round(n).toLocaleString('es-CO')}`
}

export async function POST(request: Request) {
  // Auth: solo el dueño
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { year, month } = await request.json()   // month: 1–12
  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: 'year y month (1–12) son requeridos' }, { status: 400 })
  }

  const firstOfMonth = new Date(year, month - 1, 1)
  const firstOfNext  = new Date(year, month, 1)
  const monthLabel   = `${MONTH_NAMES[month - 1]} ${year}`

  const from = firstOfMonth.toISOString()
  const to   = firstOfNext.toISOString()

  const admin = sb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rows, error } = await admin
    .from('reservations')
    .select('status,total_amount,paid_amount,remaining_balance,client_name,plan_name,check_in,check_out')
    .gte('created_at', from)
    .lt('created_at', to)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all = rows ?? []

  const confirmedCount = all.filter(r => r.status === 'confirmed').length
  const completedCount = all.filter(r => r.status === 'completed').length
  const cancelledCount = all.filter(r => r.status === 'cancelled').length
  const pendingCount   = all.filter(r => r.status === 'pending').length

  const active       = all.filter(r => r.status !== 'cancelled')
  const totalRevenue = active.reduce((s, r) => s + (r.total_amount   ?? 0), 0)
  const totalPaid    = active.reduce((s, r) => s + (r.paid_amount    ?? 0), 0)
  const totalBalance = active.reduce((s, r) => s + (r.remaining_balance ?? 0), 0)

  // Texto del reporte
  const now   = new Date()
  const lines = [
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
    ...all.flatMap(r => [
      `${r.client_name} — ${r.plan_name}`,
      `  Check-in:  ${r.check_in?.substring(0, 16)}`,
      `  Check-out: ${r.check_out?.substring(0, 16)}`,
      `  Estado:    ${r.status}`,
      `  Total:     ${fmtCOP(r.total_amount ?? 0)}  Pagado: ${fmtCOP(r.paid_amount ?? 0)}  Saldo: ${fmtCOP(r.remaining_balance ?? 0)}`,
      '',
    ]),
  ]

  const reportText = lines.join('\n')
  const reportName = `Reporte ${monthLabel}`

  let driveLink: string | undefined
  try {
    const folderId = await ensureFolderPath([String(year), 'Reportes'])
    const uploaded = await uploadFile({
      parentId:      folderId,
      fileName:      `${reportName}.txt`,
      mimeType:      'text/plain',
      contentBase64: Buffer.from(reportText, 'utf-8').toString('base64'),
    })
    driveLink = uploaded.webViewLink ?? undefined
  } catch (e) {
    console.error('[reports/generate] drive error', e)
  }

  return NextResponse.json({
    ok:             true,
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
}
