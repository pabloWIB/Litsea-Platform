'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'
import { ExternalLink, Download, CloudUpload, Paperclip } from 'lucide-react'
import { ReservationFormData } from '../types/reservation'

interface ReservationPreviewProps {
  formData:     ReservationFormData
  onBackToForm: () => void
}

function parsePlan(planType: string) {
  const parts = planType.split('|')
  return { name: parts[0] || '', defaultPrice: parseInt(parts[1]) || 0, isFlat: parts[2] === 'flat' }
}

function formatCOP(value: number): string {
  return value.toLocaleString('es-CO')
}

export default function ReservationPreview({ formData, onBackToForm }: ReservationPreviewProps) {
  const cardRef    = useRef<HTMLDivElement>(null)
  const router     = useRouter()
  const [receipt,  setReceipt]  = useState<File | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState<{ drive: string; calendar?: string } | null>(null)

  const { name: planName, isFlat } = parsePlan(formData.planType)

  const nights = (() => {
    if (isFlat) return 1
    const ci = new Date(formData.checkIn)
    const co = new Date(formData.checkOut)
    if (isNaN(ci.getTime()) || isNaN(co.getTime())) return 1
    return Math.max(1, Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24)))
  })()

  const price          = Number(formData.planPrice) || 0
  const planCost       = isFlat ? price : price * nights
  const discountPct    = Math.min(100, Math.max(0, Number(formData.discountPercent) || 0))
  const discountAmount = Number(formData.discountAmount) || Math.round(planCost * discountPct / 100)

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('es-CO', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    })

  const saveAsImage = () => {
    if (!cardRef.current) return
    html2canvas(cardRef.current, { backgroundColor: null, scale: 2, logging: false, useCORS: true })
      .then(canvas => {
        const a = document.createElement('a')
        a.download = `reserva-${(formData.clientName || 'sin-nombre').replace(/\s+/g, '-')}.jpg`
        a.href = canvas.toDataURL('image/jpeg', 0.9)
        a.click()
      })
      .catch(() => alert('Error al generar la imagen. Inténtelo de nuevo.'))
  }

  const handleSaveToDrive = async () => {
    if (!cardRef.current) return
    setSaving(true)
    const tid = toast.loading('Guardando en Drive y Calendario…')
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, scale: 2, logging: false, useCORS: true,
      })
      const cardImageBase64 = canvas.toDataURL('image/jpeg', 0.9).split('base64,')[1]

      let receiptPayload: { fileName: string; mimeType: string; contentBase64: string } | null = null
      if (receipt) {
        const contentBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload  = () => { const r = reader.result as string; const i = r.indexOf('base64,'); resolve(i >= 0 ? r.slice(i + 7) : r) }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(receipt)
        })
        receiptPayload = { fileName: receipt.name, mimeType: receipt.type || 'application/octet-stream', contentBase64 }
      }

      const res  = await fetch('/api/reservations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ formData, cardImageBase64, receipt: receiptPayload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')

      toast.dismiss(tid)
      toast.success('¡Reserva guardada en Drive y Calendario!')
      setSaved({ drive: data.driveFolderLink, calendar: data.eventLink })

      if (data.reservationId) {
        setTimeout(() => router.push(`/reservations/${data.reservationId}`), 1800)
      }
    } catch (err) {
      toast.dismiss(tid)
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-purple-300 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-sm sm:text-base mt-0.5">{value}</p>
    </div>
  )

  return (
    <div className="w-full space-y-5">

      {/* ── Reservation card (used for html2canvas) ── */}
      <div
        ref={cardRef}
        className="bg-purple-900 text-white relative overflow-hidden rounded-xl shadow-xl mx-auto"
        style={{ maxWidth: 800 }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(/bienvenida-glamping.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        <div className="relative p-5 sm:p-7 space-y-6">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <Image
              src="/web-app-manifest-512x512-color.png"
              alt="Reserva del Ruiz"
              width={56}
              height={56}
              className="rounded-xl flex-shrink-0"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Reserva del Ruiz</h2>
              <p className="text-purple-300 text-sm">El glamping de un millón de estrellas</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/10 rounded-xl p-4 sm:p-6 backdrop-blur-md space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Row label="Cliente" value={formData.clientName} />
              {formData.phone && <Row label="Teléfono" value={formData.phone} />}
            </div>

            <div className="border-t border-white/10" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wide">Plan seleccionado</p>
                <p className="font-semibold text-base">{planName}</p>
                <div className="text-sm text-purple-200 space-y-1 mt-1">
                  {isFlat ? (
                    <p>Valor del plan: <span className="text-white font-medium">${formatCOP(price)}</span></p>
                  ) : (
                    <>
                      <p>Precio por noche: <span className="text-white font-medium">${formatCOP(price)}</span></p>
                      <p>Noches: <span className="text-white font-medium">{nights}</span></p>
                      <p>Subtotal plan: <span className="text-white font-medium">${formatCOP(planCost)}</span></p>
                    </>
                  )}
                  {discountPct > 0 && (
                    <p className="text-green-300">Descuento {discountPct}%: <span className="font-medium">− ${formatCOP(discountAmount)}</span></p>
                  )}
                  {Number(formData.additionalCost) > 0 && (
                    <p>
                      {formData.additional || 'Servicios adicionales'}:{' '}
                      <span className="text-white font-medium">${formatCOP(Number(formData.additionalCost))}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wide mb-2">Estado del pago</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Total a pagar</span>
                    <span className="font-bold text-base">${formatCOP(formData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Pagado</span>
                    <span className="font-semibold text-green-300">${formatCOP(Number(formData.paidAmount) || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2">
                    <span className="text-purple-200">Saldo pendiente</span>
                    <span className={`font-bold text-base ${formData.remainingBalance <= 0 ? 'text-green-300' : 'text-orange-300'}`}>
                      ${formatCOP(formData.remainingBalance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10" />

            <div>
              <p className="text-purple-300 text-xs font-medium uppercase tracking-wide mb-2">Fechas de estancia</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-purple-200">Check-in: </span><span className="font-semibold">{formatDate(formData.checkIn)}</span></p>
                <p><span className="text-purple-200">Check-out: </span><span className="font-semibold">{formatDate(formData.checkOut)}</span></p>
              </div>
            </div>

            {formData.datos && (
              <>
                <div className="border-t border-white/10" />
                <div>
                  <p className="text-purple-300 text-xs font-medium uppercase tracking-wide mb-2">Huéspedes</p>
                  <pre className="whitespace-pre-wrap break-words text-sm bg-white/5 p-3 rounded-lg font-sans">{formData.datos}</pre>
                </div>
              </>
            )}

            {formData.notes && (
              <>
                <div className="border-t border-white/10" />
                <div>
                  <p className="text-purple-300 text-xs font-medium uppercase tracking-wide mb-2">Notas</p>
                  <p className="text-sm bg-white/5 p-3 rounded-lg">{formData.notes}</p>
                </div>
              </>
            )}
          </div>

          <div className="text-center pt-4 border-t border-white/20 space-y-1">
            <p className="text-base sm:text-lg italic">¡Gracias por elegirnos!</p>
            <p className="text-purple-300 text-xs">Reserva del Ruiz — El glamping de un millón de estrellas</p>
            <p className="text-purple-300 text-xs">WhatsApp: +57 315 277 9642 · Instagram: @reservadelruiz</p>
          </div>
        </div>
      </div>

      {/* ── Comprobante + actions ── */}
      <div className="max-w-[800px] mx-auto space-y-3">

        {/* Receipt upload */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Comprobante de pago <span className="font-normal normal-case">(opcional)</span>
          </p>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors px-3 py-2 rounded-lg">
              <Paperclip size={13} /> Adjuntar archivo
            </span>
            <input type="file" accept="image/*,application/pdf"
              onChange={e => setReceipt(e.target.files?.[0] ?? null)}
              className="hidden" />
          </label>
          {receipt && (
            <p className="text-xs text-neutral-400 mt-2">
              📎 {receipt.name} · {(receipt.size / 1024).toFixed(0)} KB
            </p>
          )}
        </div>

        {/* Saved links */}
        {saved && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-green-800">¡Guardado correctamente!</p>
            <a href={saved.drive} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 transition-colors">
              <ExternalLink size={13} /> Abrir carpeta en Drive
            </a>
            {saved.calendar && (
              <a href={saved.calendar} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 transition-colors">
                <ExternalLink size={13} /> Abrir evento en Calendario
              </a>
            )}
            <p className="text-xs text-green-600 mt-1">Redirigiendo al detalle de la reserva…</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button onClick={onBackToForm}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-sm font-medium py-2.5 px-5 rounded-xl transition-colors">
            ← Volver al formulario
          </button>
          <button onClick={saveAsImage}
            className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-colors">
            <Download size={14} /> Guardar imagen
          </button>
          <button onClick={handleSaveToDrive} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-colors">
            <CloudUpload size={14} />
            {saving ? 'Guardando…' : '☁️ Drive + Calendario'}
          </button>
        </div>
      </div>
    </div>
  )
}
