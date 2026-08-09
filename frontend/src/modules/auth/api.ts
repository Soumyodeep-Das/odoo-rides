import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'
import type { LoginPayload, OnboardPayload, EmployeeOnboardPayload, AuthResponse } from './types'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload)
  return data
}

export async function onboard(payload: OnboardPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>(ENDPOINTS.AUTH.ONBOARD, payload)
  return data
}

export async function employeeOnboard(payload: EmployeeOnboardPayload): Promise<AuthResponse> {
  const form = new FormData()
  form.append('token', payload.token)
  form.append('password', payload.password)
  form.append('phone', payload.phone)
  if (payload.avatar) {
    form.append('avatar', payload.avatar)
  }

  // Use fetch directly for multipart — axios would also work but FormData headers need to be auto-set
  const res = await fetch(`${client.defaults.baseURL}${ENDPOINTS.AUTH.EMPLOYEE_ONBOARD}`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error ?? 'Onboarding failed')
  }
  return res.json()
}

export async function getMe() {
  const { data } = await client.get(ENDPOINTS.AUTH.ME)
  return data
}
