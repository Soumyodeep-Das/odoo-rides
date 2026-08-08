import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'
import type { Booking, CreateBookingPayload } from './types'

export async function getMyBookings(): Promise<Booking[]> {
  const { data } = await client.get<Booking[]>(ENDPOINTS.BOOKINGS.LIST)
  return data
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await client.post<Booking>(ENDPOINTS.BOOKINGS.CREATE, payload)
  return data
}

export async function cancelBooking(id: number): Promise<void> {
  await client.post(ENDPOINTS.BOOKINGS.CANCEL(id))
}
