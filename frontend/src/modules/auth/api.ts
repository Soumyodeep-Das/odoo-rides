import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'
import type { LoginPayload, RegisterPayload, AuthResponse } from './types'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, payload)
  return data
}

export async function getMe() {
  const { data } = await client.get(ENDPOINTS.AUTH.ME)
  return data
}

export async function logout() {
  await client.post(ENDPOINTS.AUTH.LOGOUT)
}
