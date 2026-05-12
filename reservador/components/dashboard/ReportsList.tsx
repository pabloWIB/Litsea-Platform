'use client'

import { useState } from 'react'
import { ExternalLink, FileText, Loader2, TrendingUp } from 'lucide-react'

type ReportFile = {
  id: string
  name: string
  webViewLink?: string
  createdTime?: string
}

type GeneratedReport = {
  monthLabel:     string
  totalCount:     number
  confirmedCount: number
  completedCount: number
  cancelledCount: number
  totalRevenue:   number
  totalPaid:      number
  totalBalance:   number
  driveLink?:     string
}

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function fmtCOP(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CO')
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Build list of past months (up to 24) for the selector
function pastMonths() {
  const now    = new Date()
  const result: { label: string; year: number; month: number }[] = []
  for (let i = 1; i <= 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({ label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, year: d.getFullYear(), month: d.getMonth() + 1 })
  }
  return result
}

export default function ReportsList({ reports: initial }: { reports: ReportFile[] }) {
  const months = pastMonths()

  const [reports,   setReports]   = useState<ReportFile[]>(initial)
  const [selIndex,  setSelIndex]  = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [generated, setGenerated] = useState<GeneratedReport | null>(null)
  const [error,     setError]     = useState<string | null>(null)

  const sel = months[selIndex]

  async function generate() {
    setLoading(true)
    setError(null)
    setGenerated(null)
    try {
      const res = await fetch('/api/reports/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ year: sel.year, month: sel.month }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al generar el reporte')
      setGenerated(data)
      // Add to list if it has a Drive link
      if (data.driveLink) {
        const newFile: ReportFile = {
          id:          crypto.randomUUID(),
          name:        `Reporte ${data.monthLabel}.txt`,
          webViewLink: data.driveLink,
          createdTime: new Date().toISOString(),
        }
        setReports(prev => [newFile, ...prev.filter(r => !r.name.includes(data.monthLabel))])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Generar reporte manual ───────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-1">
            Reporte manual
          </p>
          <p className="text-sm text-neutral-500">
            Genera el reporte de cualquier mes anterior y súbelo a Google Drive.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selIndex}
            onChange={e => setSelIndex(Number(e.target.value))}
            className="flex-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>{m.label}</option>
            ))}
          </select>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 shrink-0"
          >
            {loading
              ? <><Loader2 size={14} className="animate-spin" /> Generando…</>
              : <><TrendingUp size={14} /> Generar</>
            }
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        {/* Generated result */}
        {generated && (
          <div className="bg-stone-50 rounded-xl border border-neutral-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-900">
                Reporte {generated.monthLabel}
              </p>
              {generated.driveLink && (
                <a
                  href={generated.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <ExternalLink size={12} /> Ver en Drive
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Reservas',  value: generated.totalCount },
                { label: 'Ingresos',  value: fmtCOP(generated.totalRevenue) },
                { label: 'Cobrado',   value: fmtCOP(generated.totalPaid) },
                { label: 'Pendiente', value: fmtCOP(generated.totalBalance) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl px-3 py-2.5 border border-neutral-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Historial de reportes ────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Historial · {reports.length} reporte{reports.length !== 1 ? 's' : ''}
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">
            <FileText size={28} className="mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">No hay reportes generados aún.</p>
            <p className="text-xs mt-1">Genera el primero con el formulario de arriba.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50">
            {reports.map(r => {
              const label = r.name.replace(/^Reporte /, '').replace(/\.txt$/, '')
              return (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <FileText size={15} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900">{label}</p>
                    {r.createdTime && (
                      <p className="text-xs text-neutral-400">{fmtDate(r.createdTime)}</p>
                    )}
                  </div>
                  {r.webViewLink && (
                    <a
                      href={r.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors shrink-0"
                    >
                      <ExternalLink size={13} /> Ver en Drive
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
