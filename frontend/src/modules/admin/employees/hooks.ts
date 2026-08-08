import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEmployees,
  addEmployee,
  toggleEmployeeAccess,
  deleteEmployee,
} from './api'
import type { AddEmployeePayload } from './types'

export const EMPLOYEES_KEY = ['admin', 'employees'] as const

export function useEmployees() {
  return useQuery({ queryKey: EMPLOYEES_KEY, queryFn: getEmployees })
}

export function useAddEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddEmployeePayload) => addEmployee(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  })
}

export function useToggleEmployeeAccess() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleEmployeeAccess(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EMPLOYEES_KEY }),
  })
}
