'use client'

import { useState, useEffect } from 'react'
import { ReservationFormData } from '../types/reservation'

const PLANS = [
  { label: 'Personal — $250.000 / noche',                            value: 'Personal|250000|night' },
  { label: 'Pasadía 8 horas — $280.000',                             value: 'Pasadía 8 horas|280000|flat' },
  { label: 'Plan pareja semana (Lun–Jue) — $350.000 / noche',        value: 'Plan pareja semana|350000|night' },
  { label: 'Plan pareja fin de semana (Vie–Dom) — $420.000 / noche', value: 'Plan pareja fin de semana|420000|night' },
  { label: 'Plan pareja pasadía — $280.000',                         value: 'Plan pareja pasadía|280000|flat' },
  { label: 'Plan familiar 3 personas — $450.000 / noche',            value: 'Plan familiar 3 personas|450000|night' },
  { label: 'Plan familiar 4 personas — $450.000 / noche',            value: 'Plan familiar 4 personas|450000|night' },
  { label: 'Plan familiar pasadía — $350.000',                       value: 'Plan familiar pasadía|350000|flat' },
]

const ADDITIONAL_SERVICE_PRESETS = [
  { label: '— Seleccionar decoración —', description: '', price: 0 },
  {
    label: 'Decoración romántica — $70.000',
    description: 'Decoración de bombas de corazones, pétalos de rosa, pétalos de rosa "quieres ser mi novia" y letras bomba te amo.',
    price: 70000,
  },
  {
    label: 'Decoración de bombas de cumpleaños — $40.000',
    description: 'Decoración de bombas de cumpleaños',
    price: 40000,
  },
]

function parsePlan(planType: string) {
  const parts = planType.split('|')
  return { name: parts[0] || '', defaultPrice: parseInt(parts[1]) || 0, isFlat: parts[2] === 'flat' }
}

function formatCOP(value: number): string {
  return value.toLocaleString('es-CO')
}

const pad = (n: number) => String(n).padStart(2, '0')

function addHours(datetimeLocal: string, hours: number): string {
  const d = new Date(datetimeLocal)
  d.setTime(d.getTime() + hours * 60 * 60 * 1000)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function autoTimes(datePart: string, isFlat: boolean): { checkIn: string; checkOut: string } {
  if (!datePart) return { checkIn: '', checkOut: '' }
  const defaultTime = isFlat ? '10:00' : '15:00'
  const duration    = isFlat ? 8 : 22
  const checkIn     = `${datePart}T${defaultTime}`
  return { checkIn, checkOut: addHours(checkIn, duration) }
}

// ─── Shared input class ───────────────────────────────────────────
const input = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15 transition-all placeholder:text-neutral-400'

interface ReservationFormProps {
  onSubmit:    (data: ReservationFormData) => void
  initialData: ReservationFormData
}

export default function ReservationForm({ onSubmit, initialData }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>(initialData)
  const [servicePresets, setServicePresets] = useState(
    ADDITIONAL_SERVICE_PRESETS.filter(p => p.description).map(p => ({ ...p }))
  )

  useEffect(() => { recalculate(formData) }, [
    formData.planType, formData.planPrice, formData.checkIn,
    formData.checkOut, formData.additionalCost, formData.discountPercent,
  ])

  function recalculate(data: ReservationFormData) {
    const { isFlat } = parsePlan(data.planType)
    const price          = Number(data.planPrice) || 0
    const additionalCost = Number(data.additionalCost) || 0
    const discountPct    = Math.min(100, Math.max(0, Number(data.discountPercent) || 0))

    let nights = 1
    if (!isFlat) {
      const ci = new Date(data.checkIn)
      const co = new Date(data.checkOut)
      if (!isNaN(ci.getTime()) && !isNaN(co.getTime()))
        nights = Math.max(1, Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24)))
    }

    const planCost       = isFlat ? price : price * nights
    const discountAmount = Math.round(planCost * discountPct / 100)
    const totalAmount    = planCost - discountAmount + additionalCost
    const paidAmount     = Number(data.paidAmount) || 0
    const remainingBalance = totalAmount - paidAmount

    setFormData(prev => ({
      ...prev,
      discountAmount,
      totalAmount:       isNaN(totalAmount)       ? 0 : totalAmount,
      remainingBalance:  isNaN(remainingBalance)  ? 0 : remainingBalance,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'planType') {
      const { defaultPrice, isFlat, name: newPlanName } = parsePlan(value)
      const existingDate = formData.checkIn?.split('T')[0]
      const today        = new Date().toISOString().split('T')[0]
      const datePart     = existingDate || today
      const { checkIn, checkOut } = autoTimes(datePart, isFlat)

      let notes = formData.notes
        .replace(/\n?1 Cama adicional/gi, '')
        .replace(/\n?2 camas adicionales/gi, '')
        .trim()
      if (newPlanName === 'Plan familiar 3 personas')
        notes = notes ? `${notes}\n1 Cama adicional` : '1 Cama adicional'
      else if (newPlanName === 'Plan familiar 4 personas')
        notes = notes ? `${notes}\n2 camas adicionales` : '2 camas adicionales'

      setFormData(prev => ({ ...prev, planType: value, planPrice: defaultPrice, checkIn, checkOut, notes }))
      return
    }

    if (name === 'checkIn') {
      if (value && formData.planType) {
        const { isFlat } = parsePlan(formData.planType)
        setFormData(prev => ({ ...prev, checkIn: value, checkOut: addHours(value, isFlat ? 8 : 22) }))
      } else {
        setFormData(prev => ({ ...prev, checkIn: value }))
      }
      return
    }

    const numericFields = ['planPrice', 'additionalCost', 'paidAmount', 'discountPercent']
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      remainingBalance: prev.totalAmount - (Number(prev.paidAmount) || 0),
    }))
  }, [formData.paidAmount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName.trim()) { alert('Por favor ingrese el nombre del cliente.'); return }
    if (!formData.planType)          { alert('Por favor seleccione un plan.'); return }
    if (!formData.checkIn)           { alert('Por favor seleccione la fecha de entrada.'); return }
    if (!formData.checkOut)          { alert('Por favor seleccione la fecha de salida.'); return }
    onSubmit(formData)
  }

  const { isFlat, name: planName } = parsePlan(formData.planType)
  const isPersonalPlan = planName === 'Personal'

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
  const discountAmount = Math.round(planCost * discountPct / 100)

  const Section = ({ title }: { title: string }) => (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">{title}</p>
  )

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-neutral-600 mb-1.5">{children}</label>
  )

  return (
    <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-7">

        {/* ── 1. Cliente ── */}
        <section>
          <Section title="Información del cliente" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre <span className="text-red-400">*</span></Label>
              <input type="text" name="clientName" value={formData.clientName}
                onChange={handleChange} className={input} placeholder="Nombre completo" />
            </div>
            <div>
              <Label>Teléfono <span className="text-neutral-400 font-normal text-[10px]">opcional</span></Label>
              <input type="tel" name="phone" value={formData.phone}
                onChange={handleChange} className={input} placeholder="315 277 9642" />
            </div>
          </div>
        </section>

        {/* ── 2. Plan ── */}
        <section>
          <Section title="Plan y precio" />
          <div className="space-y-3">
            <div>
              <Label>Plan <span className="text-red-400">*</span></Label>
              <select name="planType" value={formData.planType} onChange={handleChange}
                className={input}>
                <option value="">— Seleccione un plan —</option>
                {PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {formData.planType && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-orange-50/60 border border-orange-100 rounded-xl">
                <div>
                  <Label>
                    {isFlat ? 'Precio del plan' : 'Precio por noche'}
                    {isPersonalPlan && <span className="ml-1 text-[10px] text-orange-500 font-normal">— edita el valor</span>}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input type="number" name="planPrice" value={formData.planPrice || ''} onChange={handleChange}
                      className={`${input} pl-7`} placeholder="0" min="0" />
                  </div>
                  <p className="mt-1 text-[10px] text-neutral-400">Cambia el valor si aplica precio especial</p>
                </div>
                <div>
                  <Label>Descuento</Label>
                  <div className="relative">
                    <input type="number" name="discountPercent" value={formData.discountPercent || ''}
                      onChange={handleChange} className={`${input} pr-8`} placeholder="0" min="0" max="100" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
                  </div>
                  {discountPct > 0 && (
                    <p className="mt-1 text-[10px] text-green-600 font-medium">
                      − ${formatCOP(discountAmount)} de descuento
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. Fechas ── */}
        <section>
          <Section title="Fechas de estancia" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Entrada <span className="text-red-400">*</span></Label>
              <input type="datetime-local" name="checkIn" value={formData.checkIn}
                onChange={handleChange} className={input} />
            </div>
            <div>
              <Label>Salida <span className="text-red-400">*</span></Label>
              <input type="datetime-local" name="checkOut" value={formData.checkOut}
                onChange={handleChange} className={input} />
            </div>
          </div>
          {formData.planType && formData.checkIn && formData.checkOut && (
            <p className="mt-2 text-xs text-orange-600 font-medium">
              {isFlat
                ? '1 día (pasadía)'
                : `${nights} noche${nights !== 1 ? 's' : ''} · $${formatCOP(planCost)} subtotal del plan`}
            </p>
          )}
        </section>

        {/* ── 4. Huéspedes ── */}
        <section>
          <Section title="Información de huéspedes" />
          <textarea name="datos" value={formData.datos} onChange={handleChange} rows={6}
            className={`${input} resize-vertical font-mono text-xs`}
            placeholder={"Nombre completo:\nCelular:\nC.C:\nDirección:\nCorreo electrónico:"} />
        </section>

        {/* ── 5. Servicios adicionales ── */}
        <section>
          <Section title="Servicios adicionales" />
          <div className="space-y-3">
            <div className="space-y-2">
              {servicePresets.map((preset, i) => {
                const isSelected = formData.additional === preset.description && Number(formData.additionalCost) === preset.price
                return (
                  <div key={i} className={`border rounded-xl p-3 space-y-2 transition-colors ${
                    isSelected ? 'border-orange-300 bg-orange-50' : 'border-neutral-200 bg-white'
                  }`}>
                    <div className="flex gap-2 items-start">
                      <textarea value={preset.description} rows={2}
                        onChange={e => setServicePresets(prev => prev.map((p, j) => j === i ? { ...p, description: e.target.value } : p))}
                        className={`flex-1 px-2.5 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 bg-white resize-none outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15`}
                      />
                      <div className="flex flex-col gap-1.5 min-w-[110px]">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                          <input type="number" value={preset.price} min="0"
                            onChange={e => setServicePresets(prev => prev.map((p, j) => j === i ? { ...p, price: Number(e.target.value) } : p))}
                            className="w-full pl-5 pr-2 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-900 bg-white outline-none focus:border-orange-400"
                          />
                        </div>
                        <button type="button"
                          onClick={() => setFormData(prev => ({ ...prev, additional: preset.description, additionalCost: preset.price }))}
                          className={`px-2 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                            isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}>
                          {isSelected ? '✓ Seleccionado' : 'Usar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Descripción adicional</Label>
                <textarea name="additional" value={formData.additional} onChange={handleChange} rows={3}
                  className={`${input} resize-vertical`} placeholder="Desayuno, decoración, transporte…" />
              </div>
              <div>
                <Label>Valor adicionales</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input type="number" name="additionalCost" value={formData.additionalCost || ''}
                    onChange={handleChange} className={`${input} pl-7`} placeholder="0" min="0" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Notas ── */}
        <section>
          <Section title="Notas internas" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
            className={`${input} resize-vertical`} placeholder="Notas adicionales para la reserva…" />
        </section>

        {/* ── 7. Resumen de pago ── */}
        <section className="bg-neutral-50 border border-neutral-100 rounded-xl p-5 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Resumen de pago</p>

          {formData.planType && (
            <div className="text-sm text-neutral-600 space-y-1 border-b border-neutral-200 pb-4">
              <div className="flex justify-between">
                <span>{isFlat ? `${planName} (día)` : `${planName} × ${nights} noche${nights !== 1 ? 's' : ''}`}</span>
                <span className="font-semibold text-neutral-900">${formatCOP(planCost)}</span>
              </div>
              {discountPct > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento {discountPct}%</span>
                  <span>− ${formatCOP(discountAmount)}</span>
                </div>
              )}
              {Number(formData.additionalCost) > 0 && (
                <div className="flex justify-between">
                  <span>Servicios adicionales</span>
                  <span className="font-semibold text-neutral-900">${formatCOP(Number(formData.additionalCost))}</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Total a pagar</p>
              <div className="px-3 py-2.5 bg-orange-50 border border-orange-100 rounded-xl text-orange-900 font-bold text-base">
                ${formatCOP(formData.totalAmount)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Valor pagado</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input type="number" name="paidAmount" value={formData.paidAmount || ''}
                  onChange={handleChange} className={`${input} pl-7`} placeholder="0" min="0" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">Saldo pendiente</p>
              <div className={`px-3 py-2.5 rounded-xl font-bold text-base border ${
                formData.remainingBalance <= 0
                  ? 'bg-green-50 border-green-100 text-green-800'
                  : 'bg-amber-50 border-amber-100 text-amber-800'
              }`}>
                ${formatCOP(formData.remainingBalance)}
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <button type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold text-sm transition-colors">
          Generar reserva →
        </button>
      </form>
    </div>
  )
}
