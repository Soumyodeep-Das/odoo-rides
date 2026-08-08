import { useQuery } from '@tanstack/react-query'
import {
  getReportSummary,
  getRidesByDay,
  getRideStatusBreakdown,
  getSeatUtilization,
} from './api'

export const REPORT_SUMMARY_KEY    = ['admin', 'reports', 'summary']          as const
export const RIDES_BY_DAY_KEY      = ['admin', 'reports', 'rides-by-day']     as const
export const RIDE_STATUS_KEY       = ['admin', 'reports', 'ride-status']      as const
export const SEAT_UTILIZATION_KEY  = ['admin', 'reports', 'seat-utilization'] as const

export function useReportSummary() {
  return useQuery({ queryKey: REPORT_SUMMARY_KEY, queryFn: getReportSummary })
}

export function useRidesByDay(days = 14) {
  return useQuery({
    queryKey: [...RIDES_BY_DAY_KEY, days],
    queryFn:  () => getRidesByDay(days),
  })
}

export function useRideStatusBreakdown() {
  return useQuery({ queryKey: RIDE_STATUS_KEY, queryFn: getRideStatusBreakdown })
}

export function useSeatUtilization(days = 14) {
  return useQuery({
    queryKey: [...SEAT_UTILIZATION_KEY, days],
    queryFn:  () => getSeatUtilization(days),
  })
}
