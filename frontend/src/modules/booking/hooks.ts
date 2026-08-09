import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '#core/hooks/useAuth'
import { getMyBookings, bookRide, cancelBooking } from './api'
import type { CreateBookingPayload } from './types'

export const BOOKINGS_KEY = ['bookings'] as const

export function useMyBookings() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [...BOOKINGS_KEY, user?.id],
    queryFn: () => getMyBookings(user!.id),
    enabled: !!user,
  })
}

export function useBookRide() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookRide(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY })
      // Also invalidate rides so available seat counts refresh
      qc.invalidateQueries({ queryKey: ['rides'] })
    },
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ rideId, bookingId }: { rideId: string; bookingId: string }) =>
      cancelBooking(rideId, bookingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BOOKINGS_KEY })
      qc.invalidateQueries({ queryKey: ['rides'] })
    },
  })
}

/** @deprecated Use useBookRide instead */
export const useCreateBooking = useBookRide
