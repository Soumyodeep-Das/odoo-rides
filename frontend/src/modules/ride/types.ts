export interface Ride {
  id: number
  origin: string
  destination: string
  departureTime: string
  availableSeats: number
  pricePerSeat: number
  driver: {
    id: number
    name: string
  }
  status: 'active' | 'full' | 'cancelled' | 'completed'
}

export interface CreateRidePayload {
  origin: string
  destination: string
  departureTime: string
  availableSeats: number
  pricePerSeat: number
}
