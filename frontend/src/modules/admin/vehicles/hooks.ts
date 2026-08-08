import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVehicles,
  addVehicle,
  updateVehicleStatus,
  deleteVehicle,
} from './api'
import type { AddVehiclePayload, Vehicle } from './types'

export const VEHICLES_KEY = ['admin', 'vehicles'] as const

export function useVehicles() {
  return useQuery({ queryKey: VEHICLES_KEY, queryFn: getVehicles })
}

export function useAddVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddVehiclePayload) => addVehicle(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: VEHICLES_KEY }),
  })
}

export function useUpdateVehicleStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Vehicle['status'] }) =>
      updateVehicleStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: VEHICLES_KEY }),
  })
}

export function useDeleteVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: VEHICLES_KEY }),
  })
}
