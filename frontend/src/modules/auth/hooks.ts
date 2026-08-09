import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '#core/hooks/useAuth'
import { login, onboard, employeeOnboard } from './api'
import type { LoginPayload, OnboardPayload, EmployeeOnboardPayload } from './types'

export function useLogin() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      // Route by role
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/', { replace: true })
    },
  })
}

export function useOnboard() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: OnboardPayload) => onboard(payload),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate('/admin/dashboard', { replace: true })
    },
  })
}

export function useEmployeeOnboard() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: EmployeeOnboardPayload) => employeeOnboard(payload),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate('/', { replace: true })
    },
  })
}
