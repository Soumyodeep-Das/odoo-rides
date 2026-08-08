import type { Ride } from '#modules/ride/types'

export interface BookingPassenger {
  id: string
  name: string
  email: string
  phone: string
}

export interface BookingPayment {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
  method: 'CASH' | 'CARD' | 'UPI' | 'WALLET'
}

export interface Booking {
  id: string
  rideId: string
  passengerId: string
  seats: number
  status: 'CONFIRMED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
  ride?: Ride
  passenger?: BookingPassenger
  payment?: BookingPayment
}

/** Payload for POST /api/rides/:rideId/book */
export interface CreateBookingPayload {
  rideId: string
  passengerId: string
  seats: number
  paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'WALLET'
}
