import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Reservation = {
  id: string
  created_at: string
  client_name: string
  phone: string | null
  client_email: string | null
  plan_name: string
  plan_price: number
  is_flat: boolean
  check_in: string
  check_out: string
  nights: number
  guests_info: string | null
  extra_description: string | null
  extra_cost: number
  discount_percent: number
  discount_amount: number
  total_amount: number
  paid_amount: number
  remaining_balance: number
  status: string
  notes: string | null
}

type Props = { reservation: Reservation; logo: string }

const O  = '#f97316'
const N9 = '#171717'
const N6 = '#525252'
const N4 = '#a3a3a3'
const N2 = '#e5e5e5'
const N1 = '#f5f5f5'
const N0 = '#fafafa'
const AM = '#d97706'
const GR = '#16a34a'
const WH = '#ffffff'

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmada', color: '#166534', bg: '#dcfce7' },
  pending:   { label: 'Pendiente',  color: '#92400e', bg: '#fef3c7' },
  cancelled: { label: 'Cancelada',  color: '#991b1b', bg: '#fee2e2' },
  postponed: { label: 'Aplazada',   color: '#991b1b', bg: '#fee2e2' },
  completed: { label: 'Completada', color: '#404040', bg: '#f5f5f5' },
}

function fmt(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

function fmtDate(d: string, f: string) {
  try { return format(new Date(d), f, { locale: es }) } catch { return d }
}

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: WH, flexDirection: 'column' },

  /* Header */
  header: {
    backgroundColor: O,
    paddingHorizontal: 40, paddingVertical: 22,
    flexDirection: 'row', alignItems: 'center',
  },
  logo: { width: 52, height: 52, marginRight: 16 },
  headerRight: { flexDirection: 'column' },
  headerName: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: WH, letterSpacing: 0.3 },
  headerBar:  { width: 28, height: 2, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 1, marginTop: 5, marginBottom: 4 },
  headerSub:  { fontSize: 8, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 2 },

  /* Body */
  body: { paddingHorizontal: 40, paddingTop: 24, paddingBottom: 56, flex: 1 },

  /* Meta row */
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  badge:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, marginRight: 12 },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  metaText:  { fontSize: 8, color: N4, marginRight: 10 },

  /* Two columns */
  cols:     { flexDirection: 'row', marginBottom: 14 },
  colLeft:  { flex: 1, marginRight: 10 },
  colRight: { flex: 1 },

  /* Section */
  secLabel: {
    fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: N4,
    textTransform: 'uppercase', letterSpacing: 2, marginBottom: 7,
  },
  section:  { marginBottom: 14 },
  card: {
    borderWidth: 1, borderColor: N2, borderStyle: 'solid',
    borderRadius: 8, overflow: 'hidden',
  },

  /* Rows */
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingVertical: 7, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: N1, borderBottomStyle: 'solid',
  },
  rowLast: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingVertical: 7, paddingHorizontal: 14,
  },
  rLabel: {
    fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: N4,
    textTransform: 'uppercase', letterSpacing: 1, maxWidth: '38%',
  },
  rVal:     { fontSize: 9,   color: N9,  textAlign: 'right', maxWidth: '62%' },
  rValBold: { fontSize: 9,   fontFamily: 'Helvetica-Bold', color: N9,  textAlign: 'right', maxWidth: '62%' },

  /* Financial special rows */
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 9, paddingHorizontal: 14,
    backgroundColor: N0,
    borderTopWidth: 1, borderTopColor: N2, borderTopStyle: 'solid',
    borderBottomWidth: 1, borderBottomColor: N2, borderBottomStyle: 'solid',
  },
  totalLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: N6, textTransform: 'uppercase', letterSpacing: 1 },
  totalValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: N9 },

  paidRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 9, paddingHorizontal: 14, backgroundColor: '#f0fdf4',
  },
  balanceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14,
  },
  finLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 },
  finValue: { fontSize: 11, fontFamily: 'Helvetica-Bold' },

  /* Footer */
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: WH,
    borderTopWidth: 1, borderTopColor: N2, borderTopStyle: 'solid',
    paddingHorizontal: 40, paddingVertical: 13,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  footerBrand:  { fontSize: 8,   fontFamily: 'Helvetica-Bold', color: N6, marginBottom: 2 },
  footerDetail: { fontSize: 7.5, color: N4 },
  footerRight:  { fontSize: 7.5, color: N4, textAlign: 'right' },
})

type RowItem = { label: string; value: string; bold?: boolean }

function renderRows(rows: RowItem[]) {
  return rows.map((r, i) => (
    <View key={r.label} style={i < rows.length - 1 ? s.row : s.rowLast}>
      <Text style={s.rLabel}>{r.label}</Text>
      <Text style={r.bold ? s.rValBold : s.rVal}>{r.value}</Text>
    </View>
  ))
}

export function ReservationDocument({ reservation: r, logo }: Props) {
  const st = STATUS[r.status] ?? STATUS.pending

  const clientRows: RowItem[] = [
    { label: 'Nombre', value: r.client_name, bold: true },
    ...(r.phone ? [{ label: 'Teléfono', value: r.phone }] : []),
    { label: 'Email', value: r.client_email ?? '—' },
  ]

  const stayRows: RowItem[] = [
    { label: 'Plan', value: r.plan_name, bold: true },
    { label: 'Check-in',  value: fmtDate(r.check_in,  "d MMM yyyy · HH:mm") },
    { label: 'Check-out', value: fmtDate(r.check_out, "d MMM yyyy · HH:mm") },
    ...(!r.is_flat ? [{ label: 'Noches', value: String(r.nights) }] : []),
    ...(r.guests_info ? [{ label: 'Huéspedes', value: r.guests_info }] : []),
  ]

  const lineItems: RowItem[] = [
    {
      label: r.is_flat
        ? `${r.plan_name} (tarifa plana)`
        : `${r.plan_name} × ${r.nights} ${r.nights === 1 ? 'noche' : 'noches'}`,
      value: fmt(r.is_flat ? r.plan_price : r.plan_price * r.nights),
    },
    ...(r.discount_percent > 0
      ? [{ label: `Descuento ${r.discount_percent}%`, value: `− ${fmt(r.discount_amount)}` }]
      : []),
    ...(r.extra_cost > 0
      ? [{
          label: r.extra_description
            ? `Adicionales — ${r.extra_description}`
            : 'Adicionales',
          value: fmt(r.extra_cost),
        }]
      : []),
  ]

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Header ─────────────────────────────────────── */}
        <View style={s.header}>
          <Image src={logo} style={s.logo} />
          <View style={s.headerRight}>
            <Text style={s.headerName}>Glamping Reserva del Ruiz</Text>
            <View style={s.headerBar} />
            <Text style={s.headerSub}>Comprobante de Reserva</Text>
          </View>
        </View>

        {/* ── Body ───────────────────────────────────────── */}
        <View style={s.body}>

          {/* Status · ID · Fecha */}
          <View style={s.metaRow}>
            <View style={[s.badge, { backgroundColor: st.bg }]}>
              <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
            </View>
            <Text style={s.metaText}>#{r.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={s.metaText}>
              Creada el {fmtDate(r.created_at, "d 'de' MMMM yyyy")}
            </Text>
          </View>

          {/* Cliente | Estancia */}
          <View style={s.cols}>
            <View style={s.colLeft}>
              <Text style={s.secLabel}>Datos del cliente</Text>
              <View style={s.card}>{renderRows(clientRows)}</View>
            </View>
            <View style={s.colRight}>
              <Text style={s.secLabel}>Estancia</Text>
              <View style={s.card}>{renderRows(stayRows)}</View>
            </View>
          </View>

          {/* Resumen financiero */}
          <View style={s.section} wrap={false}>
            <Text style={s.secLabel}>Resumen financiero</Text>
            <View style={s.card}>
              {lineItems.map((item, i) => (
                <View key={i} style={s.row}>
                  <Text style={s.rLabel}>{item.label}</Text>
                  <Text style={s.rVal}>{item.value}</Text>
                </View>
              ))}

              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Total</Text>
                <Text style={s.totalValue}>{fmt(r.total_amount)}</Text>
              </View>

              <View style={s.paidRow}>
                <Text style={[s.finLabel, { color: '#166534' }]}>Pagado</Text>
                <Text style={[s.finValue, { color: GR }]}>{fmt(r.paid_amount)}</Text>
              </View>

              <View style={[s.balanceRow, { backgroundColor: r.remaining_balance > 0 ? '#fffbeb' : '#f0fdf4' }]}>
                <Text style={[s.finLabel, { color: r.remaining_balance > 0 ? '#92400e' : '#166534' }]}>
                  Saldo pendiente
                </Text>
                <Text style={[s.finValue, { color: r.remaining_balance > 0 ? AM : GR }]}>
                  {fmt(r.remaining_balance)}
                </Text>
              </View>
            </View>
          </View>

          {/* Notas internas */}
          {r.notes ? (
            <View style={s.section}>
              <Text style={s.secLabel}>Notas internas</Text>
              <View style={s.card}>
                <View style={s.rowLast}>
                  <Text style={[s.rVal, { maxWidth: '100%', color: N6 }]}>{r.notes}</Text>
                </View>
              </View>
            </View>
          ) : null}

        </View>

        {/* ── Footer (fijo en cada página) ────────────────── */}
        <View style={s.footer} fixed>
          <View>
            <Text style={s.footerBrand}>Glamping Reserva del Ruiz</Text>
            <Text style={s.footerDetail}>Vereda Montaño, Villamaría, Caldas · A 30 min de Manizales</Text>
          </View>
          <View>
            <Text style={s.footerRight}>glampingreservadelruiz@gmail.com</Text>
            <Text style={s.footerRight}>+57 315 2779642</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
