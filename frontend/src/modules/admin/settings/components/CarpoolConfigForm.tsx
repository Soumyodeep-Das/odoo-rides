import React, { useEffect, useState } from 'react'
import type { CarpoolConfig } from '../types'

interface CarpoolConfigFormProps {
  defaultValues?: Partial<CarpoolConfig>
  onSubmit: (data: CarpoolConfig) => void
  isPending?: boolean
}

const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all'

export function CarpoolConfigForm({ defaultValues, onSubmit, isPending }: CarpoolConfigFormProps) {
  const [formData, setFormData] = useState<Record<string, string | number>>({
    fuelCostPerLitre: '', costPerKm: '', travelAllowancePerKm: '', bookingCutoffMinutes: ''
  })

  useEffect(() => {
    if (defaultValues) {
      setFormData(prev => ({ ...prev, ...defaultValues }))
    }
  }, [defaultValues])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      fuelCostPerLitre: Number(formData.fuelCostPerLitre),
      costPerKm: Number(formData.costPerKm),
      travelAllowancePerKm: Number(formData.travelAllowancePerKm),
      bookingCutoffMinutes: Number(formData.bookingCutoffMinutes),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="cp-fuel" className="text-sm font-medium">Fuel Cost per Litre <span className="ml-1 text-xs text-muted-foreground">(₹)</span></label>
          <input id="cp-fuel" name="fuelCostPerLitre" type="number" min="0" step="0.01" value={formData.fuelCostPerLitre ?? ''} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cp-cost" className="text-sm font-medium">Cost per KM <span className="ml-1 text-xs text-muted-foreground">(₹)</span></label>
          <input id="cp-cost" name="costPerKm" type="number" min="0" step="0.01" value={formData.costPerKm ?? ''} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cp-allowance" className="text-sm font-medium">Travel Allowance per KM <span className="ml-1 text-xs text-muted-foreground">(₹)</span></label>
          <input id="cp-allowance" name="travelAllowancePerKm" type="number" min="0" step="0.01" value={formData.travelAllowancePerKm ?? ''} onChange={handleChange} className={fieldClass} />
        </div>


        <div className="space-y-1.5">
          <label htmlFor="cp-cutoff" className="text-sm font-medium">Booking Cutoff <span className="ml-1 text-xs text-muted-foreground">(mins)</span></label>
          <input id="cp-cutoff" name="bookingCutoffMinutes" type="number" min="0" step="1" value={formData.bookingCutoffMinutes ?? ''} onChange={handleChange} className={fieldClass} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors">
          {isPending ? 'Saving…' : 'Save Carpool Config'}
        </button>
      </div>
    </form>
  )
}
