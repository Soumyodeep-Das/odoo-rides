export interface CompanySettings {
  name: string
  address: string
  industry: string
  contactEmail: string
  contactPhone: string
  logoUrl?: string
}

export interface CarpoolConfig {
  fuelCostPerLitre: number
  costPerKm: number
  travelAllowancePerKm: number
  bookingCutoffMinutes: number
}

export interface SettingsPayload {
  company: CompanySettings
  carpool: CarpoolConfig
}
