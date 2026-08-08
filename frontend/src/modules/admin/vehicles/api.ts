import client from '#core/api/client'
import type { Vehicle, AddVehiclePayload } from './types'

export const getVehicles = (): Promise<Vehicle[]> =>
  client.get('/admin/vehicles').then((r) => r.data)

export const addVehicle = (data: AddVehiclePayload): Promise<Vehicle> =>
  client.post('/admin/vehicles', data).then((r) => r.data)

export const updateVehicleStatus = (
  id: string,
  status: Vehicle['status']
): Promise<Vehicle> =>
  client.patch(`/admin/vehicles/${id}/status`, { status }).then((r) => r.data)

export const deleteVehicle = (id: string): Promise<void> =>
  client.delete(`/admin/vehicles/${id}`).then(() => undefined)
