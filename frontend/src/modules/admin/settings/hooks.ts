import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateCompanySettings, updateCarpoolConfig } from './api'
import type { CompanySettings, CarpoolConfig } from './types'

export const SETTINGS_KEY = ['admin', 'settings'] as const

export function useSettings() {
  return useQuery({ queryKey: SETTINGS_KEY, queryFn: getSettings })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CompanySettings) => updateCompanySettings(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SETTINGS_KEY }),
  })
}

export function useUpdateCarpoolConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CarpoolConfig) => updateCarpoolConfig(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SETTINGS_KEY }),
  })
}
