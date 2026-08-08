import client from '#core/api/client'
import type { Employee, AddEmployeePayload } from './types'

export const getEmployees = (): Promise<Employee[]> =>
  client.get('/admin/employees').then((r) => r.data)

export const addEmployee = (data: AddEmployeePayload): Promise<Employee> =>
  client.post('/admin/employees', data).then((r) => r.data)

export const toggleEmployeeAccess = (id: string): Promise<Employee> =>
  client.patch(`/admin/employees/${id}/access`).then((r) => r.data)

export const deleteEmployee = (id: string): Promise<void> =>
  client.delete(`/admin/employees/${id}`).then(() => undefined)
