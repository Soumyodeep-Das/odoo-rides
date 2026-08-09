import { useQuery } from '@tanstack/react-query'
import { getMyVehicles } from './api'

export function useMyVehicles() {
    return useQuery({
        queryKey: ['my-vehicles'],
        queryFn: getMyVehicles,
    })
}
