import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'
import type { Booking, CreateBookingPayload } from './types'

/**
 * Fetch all bookings for a passenger.
 * Backend: GET /api/rides/my-rides/passenger/:passengerId
 * Returns: { success: true, data: Booking[] } where each Booking includes ride + payment
 */
export async function getMyBookings(passengerId: string): Promise<Booking[]> {
  const { data } = await client.get<any>(ENDPOINTS.BOOKINGS.PASSENGER(passengerId))
  return data?.data || []
}

/**
 * Book seats on a ride.
 * Backend: POST /api/rides/:rideId/book
 * Body: { passengerId, seats, paymentMethod }
 */
export async function bookRide(payload: CreateBookingPayload): Promise<any> {
  const { rideId, seats, paymentMethod = 'WALLET' } = payload
  const { data } = await client.post<any>(ENDPOINTS.BOOKINGS.BOOK(rideId), {
    seats,
    paymentMethod,
  })
  return data?.data
}

/**
 * Cancel a booking.
 * Backend: POST /api/rides/:rideId/bookings/:bookingId/cancel
 */
export async function cancelBooking(rideId: string, bookingId: string): Promise<void> {
  await client.post(ENDPOINTS.BOOKINGS.CANCEL(rideId, bookingId))
}
