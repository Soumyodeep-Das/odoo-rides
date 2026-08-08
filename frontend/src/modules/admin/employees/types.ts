export type EmployeeStatus = 'active' | 'revoked'
export type EmployeeRole = 'employee' | 'admin'

export interface Employee {
  id: string
  name: string
  email: string
  // department: string
  // manager?: string
  // location: string
  role: EmployeeRole
  status: EmployeeStatus
  joinedAt: string
}

export interface AddEmployeePayload {
  name: string
  email: string
  // department: string
  role: EmployeeRole
  // location?: string
}
