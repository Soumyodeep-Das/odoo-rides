import { useQuery } from '@tanstack/react-query'
import { getReportSummary, getRidesByDay, getDepartmentRides } from './api'

export const REPORT_SUMMARY_KEY  = ['admin', 'reports', 'summary']       as const
export const RIDES_BY_DAY_KEY    = ['admin', 'reports', 'rides-by-day']  as const
export const DEPT_RIDES_KEY      = ['admin', 'reports', 'dept-rides']    as const

export function useReportSummary() {
  return useQuery({ queryKey: REPORT_SUMMARY_KEY, queryFn: getReportSummary })
}

export function useRidesByDay(days = 30) {
  return useQuery({
    queryKey: [...RIDES_BY_DAY_KEY, days],
    queryFn: () => getRidesByDay(days),
  })
}

export function useDepartmentRides() {
  return useQuery({ queryKey: DEPT_RIDES_KEY, queryFn: getDepartmentRides })
}
