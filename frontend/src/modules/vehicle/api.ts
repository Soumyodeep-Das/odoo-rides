import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'

export interface VehiclePayload {
    make: string
    carModel: string
    color: string
    year: number
    seats: number
    regNo: string
}

export async function registerVehicle(payload: VehiclePayload) {
    const { data } = await client.post(ENDPOINTS.VEHICLES.REGISTER, payload)
    return data.data
}

export async function getMyVehicles() {
    const { data } = await client.get(ENDPOINTS.VEHICLES.MINE)
    return data.data
}
