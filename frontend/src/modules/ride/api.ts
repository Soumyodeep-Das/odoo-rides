import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'
import type { Ride, CreateRidePayload } from './types'

export async function getRides(params?: Record<string, any>): Promise<Ride[]> {
  const { data } = await client.get<Ride[]>(ENDPOINTS.RIDES.LIST, { params })
  return data
}

export async function getRide(id: number): Promise<Ride> {
  const { data } = await client.get<Ride>(ENDPOINTS.RIDES.DETAIL(id))
  return data
}

export async function createRide(payload: CreateRidePayload): Promise<Ride> {
  const { data } = await client.post<Ride>(ENDPOINTS.RIDES.CREATE, payload)
  return data
}

export async function deleteRide(id: number): Promise<void> {
  await client.delete(ENDPOINTS.RIDES.DELETE(id))
}
