'use client'

import { useState } from 'react'
import { ReservationFormData } from '@/types/reservation'
import ReservationForm from '@/components/ReservationForm'
import ReservationPreview from '@/components/ReservationPreview'

const INITIAL: ReservationFormData = {
  clientName: '',
  phone: '',
  planType: '',
  planPrice: 0,
  checkIn: '',
  checkOut: '',
  datos: '',
  additional: '',
  additionalCost: 0,
  discountPercent: 0,
  discountAmount: 0,
  totalAmount: 0,
  paidAmount: 250000,
  remainingBalance: 0,
  notes: '',
}

export default function NewReservationPage() {
  const [formData, setFormData] = useState<ReservationFormData>(INITIAL)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Nueva reserva</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {showPreview ? 'Revisa y guarda la reserva' : 'Completa los datos del huésped'}
          </p>
        </div>
        {showPreview && (
          <button
            onClick={() => setShowPreview(false)}
            className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            ← Volver al formulario
          </button>
        )}
      </div>

      {showPreview ? (
        <ReservationPreview
          formData={formData}
          onBackToForm={() => setShowPreview(false)}
        />
      ) : (
        <ReservationForm
          initialData={formData}
          onSubmit={(data) => { setFormData(data); setShowPreview(true) }}
        />
      )}
    </div>
  )
}
