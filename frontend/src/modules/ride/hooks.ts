import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRides, createRide, deleteRide } from './api'
import type { CreateRidePayload } from './types'

export const RIDES_KEY = ['rides'] as const

export function useRides(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...RIDES_KEY, params],
    queryFn: () => getRides(params),
  })
}

export function useCreateRide() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRidePayload) => createRide(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: RIDES_KEY }),
  })
}

export function useDeleteRide() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteRide(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: RIDES_KEY }),
  })
}
