import { useMutation } from '@tanstack/react-query'
import { useAuth } from '#core/hooks/useAuth'
import { login, register } from './api'
import type { LoginPayload, RegisterPayload } from './types'

export function useLogin() {
  const { setToken } = useAuth()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: ({ token }) => setToken(token),
  })
}

export function useRegister() {
  const { setToken } = useAuth()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: ({ token }) => setToken(token),
  })
}
