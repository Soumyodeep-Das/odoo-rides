// Placeholder for raw API calls, keeping inline with 'never skip a layer' rule
import type { DashboardStats } from './types'
// import client from '#core/api/client'

export const getDashboardStats = async (): Promise<DashboardStats> => {
    // Mock data for now
    return { activeRides: 0, completedTrips: 0 }
}
