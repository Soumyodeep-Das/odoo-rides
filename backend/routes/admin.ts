import { Router } from 'express'
import { onboardOrganisation } from '../controllers/admin/onboarding'
import {
  getEmployees,
  addEmployee,
  toggleEmployeeAccess,
  deleteEmployee,
} from '../controllers/admin/employees'
import {
  getVehicles,
  addVehicle,
  updateVehicleStatus,
  deleteVehicle,
} from '../controllers/admin/vehicles.js'
import {
  getSettings,
  updateCompanySettings,
  updateCarpoolConfig,
} from '../controllers/admin/settings.js'
import {
  getReportSummary,
  getRidesByDay,
  getRideStatusBreakdown,
  getSeatUtilization,
} from '../controllers/admin/reports.js'

const router = Router()

// Onboarding
router.post('/onboarding', onboardOrganisation)

// Employees
router.get('/employees', getEmployees)
router.post('/employees', addEmployee)
router.patch('/employees/:id/access', toggleEmployeeAccess)
router.delete('/employees/:id', deleteEmployee)

// Vehicles
router.get('/vehicles', getVehicles)
router.post('/vehicles', addVehicle)
router.patch('/vehicles/:id/status', updateVehicleStatus)
router.delete('/vehicles/:id', deleteVehicle)

// Settings
router.get('/settings', getSettings)
router.put('/settings/company', updateCompanySettings)
router.put('/settings/carpool', updateCarpoolConfig)

// Reports
router.get('/reports/summary', getReportSummary)
router.get('/reports/rides-by-day', getRidesByDay)
router.get('/reports/ride-status', getRideStatusBreakdown)
router.get('/reports/seat-utilization', getSeatUtilization)

export default router
