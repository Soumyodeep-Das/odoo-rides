export type VehicleStatus = 'approved' | 'pending' | 'rejected' | 'inactive'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  ownerId: string
  ownerName: string
  seats: number
  status: VehicleStatus
  registeredAt: string
}

export interface AddVehiclePayload {
  make: string
  model: string
  year: number
  licensePlate: string
  ownerId: string
  seats: number
}
