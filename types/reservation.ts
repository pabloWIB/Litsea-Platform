export interface ReservationFormData {
  clientName: string
  phone: string
  planType: string          // format: "name|defaultPrice|flat|night"
  planPrice: number         // editable, auto-filled from plan
  checkIn: string
  checkOut: string
  datos: string
  additional: string
  additionalCost: number | string
  discountPercent: number | string
  discountAmount: number
  totalAmount: number
  paidAmount: number | string
  remainingBalance: number
  notes: string
}
