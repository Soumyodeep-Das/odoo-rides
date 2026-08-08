import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyBookings, createBooking, cancelBooking } from './api'
import type { CreateBookingPayload } from './types'

export const BOOKINGS_KEY = ['bookings'] as const

export function useMyBookings() {
  return useQuery({
    queryKey: BOOKINGS_KEY,
    queryFn: getMyBookings,
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKINGS_KEY }),
  })
}
