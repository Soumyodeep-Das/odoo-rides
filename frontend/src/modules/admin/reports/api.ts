import client from '#core/api/client'
import type { ReportSummary, RidesByDayItem, DepartmentRideItem } from './types'

export const getReportSummary = (): Promise<ReportSummary> =>
  client.get('/admin/reports/summary').then((r) => r.data)

export const getRidesByDay = (days = 30): Promise<RidesByDayItem[]> =>
  client.get('/admin/reports/rides-by-day', { params: { days } }).then((r) => r.data)

export const getDepartmentRides = (): Promise<DepartmentRideItem[]> =>
  client.get('/admin/reports/department-rides').then((r) => r.data)
