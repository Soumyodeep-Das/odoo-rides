import React, { useEffect, useState } from 'react'
import type { CompanySettings } from '../types'

interface CompanyFormProps {
  defaultValues?: Partial<CompanySettings>
  onSubmit: (data: CompanySettings) => void
  isPending?: boolean
}

const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all'

export function CompanyForm({ defaultValues, onSubmit, isPending }: CompanyFormProps) {
  const [formData, setFormData] = useState<Partial<CompanySettings>>({
    name: '', address: '', industry: '', contactEmail: '', contactPhone: '', logoUrl: ''
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
    onSubmit(formData as CompanySettings)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="co-name" className="text-sm font-medium">Company Name</label>
          <input id="co-name" name="name" type="text" value={formData.name ?? ''} onChange={handleChange} className={fieldClass} />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="co-address" className="text-sm font-medium">Address</label>
          <input id="co-address" name="address" type="text" value={formData.address ?? ''} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="co-industry" className="text-sm font-medium">Industry</label>
          <input id="co-industry" name="industry" type="text" value={formData.industry ?? ''} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="co-contactEmail" className="text-sm font-medium">Contact Email</label>
          <input id="co-contactEmail" name="contactEmail" type="email" value={formData.contactEmail ?? ''} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="co-contactPhone" className="text-sm font-medium">Contact Phone</label>
          <input id="co-contactPhone" name="contactPhone" type="tel" value={formData.contactPhone ?? ''} onChange={handleChange} className={fieldClass} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="co-logoUrl" className="text-sm font-medium">Logo URL</label>
          <input id="co-logoUrl" name="logoUrl" type="url" value={formData.logoUrl ?? ''} onChange={handleChange} className={fieldClass} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors">
          {isPending ? 'Saving…' : 'Save Company Settings'}
        </button>
      </div>
    </form>
  )
}
