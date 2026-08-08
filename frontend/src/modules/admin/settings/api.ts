import client from '#core/api/client'
import type { SettingsPayload, CompanySettings, CarpoolConfig } from './types'

export const getSettings = (): Promise<SettingsPayload> =>
  client.get('/admin/settings').then((r) => r.data)

export const updateCompanySettings = (data: CompanySettings): Promise<CompanySettings> =>
  client.put('/admin/settings/company', data).then((r) => r.data)

export const updateCarpoolConfig = (data: CarpoolConfig): Promise<CarpoolConfig> =>
  client.put('/admin/settings/carpool', data).then((r) => r.data)
