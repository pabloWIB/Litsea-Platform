export interface ReservationFormData {
  clientName: string
  phone: string
  planType: string          
  planPrice: number         
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
