export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'ADMIN' | 'EMPLOYEE'
  orgId: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface OnboardPayload {
  orgName: string
  adminName: string
  adminEmail: string
  adminPassword: string
  adminPhone: string
}

export interface EmployeeOnboardPayload {
  token: string
  password: string
  phone: string
  avatar?: File
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
