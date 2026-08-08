export interface RideDriver {
  id: string
  name: string
  email: string
  phone: string
  orgId: string
  org?: { id: string; name: string }
}

export interface RideVehicle {
  id: string
  make: string
  carModel: string
  color: string
  regNo: string
  seats: number
}

export interface Ride {
  id: string
  pickup: string
  dropoff: string
  departure: string
  totalSeats: number
  availableSeats: number
  price: number
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED'
  driverId: string
  vehicleId: string
  driver: RideDriver
  vehicle: RideVehicle
  createdAt: string
  updatedAt: string
}

export interface CreateRidePayload {
  driverId: string
  vehicleId: string
  pickup: string
  dropoff: string
  departure: string
  totalSeats: number
  price: number
}
