import client from '#core/api/client'
import type {
  ReportSummary,
  RidesByDayItem,
  RideStatusItem,
  SeatUtilizationItem,
} from './types'

export const getReportSummary = (): Promise<ReportSummary> =>
  client.get('/admin/reports/summary').then((r) => r.data)

export const getRidesByDay = (days = 14): Promise<RidesByDayItem[]> =>
  client.get('/admin/reports/rides-by-day', { params: { days } }).then((r) => r.data)

/** COUNT(rides) grouped by status — powers the donut chart */
export const getRideStatusBreakdown = (): Promise<RideStatusItem[]> =>
  client.get('/admin/reports/ride-status').then((r) => r.data)

/** Available seats vs booked seats per day — powers the stacked bar */
export const getSeatUtilization = (days = 14): Promise<SeatUtilizationItem[]> =>
  client.get('/admin/reports/seat-utilization', { params: { days } }).then((r) => r.data)
