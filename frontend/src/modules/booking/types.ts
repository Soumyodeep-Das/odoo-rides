export interface Booking {
  id: number
  ride: {
    id: number
    origin: string
    destination: string
    departureTime: string
  }
  seatsBooked: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface CreateBookingPayload {
  rideId: number
  seatsBooked: number
}
