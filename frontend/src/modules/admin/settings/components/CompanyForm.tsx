import React, { useEffect } from 'react'
import type { CompanySettings } from '../types'

interface CompanyFormProps {
  defaultValues?: Partial<CompanySettings>
  onSubmit: (data: CompanySettings) => void
  isPending?: boolean
}

const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all'

const fields: { name: keyof CompanySettings; label: string; type?: string; placeholder: string }[] = [
  { name: 'name',         label: 'Company Name',   placeholder: 'Acme Corp'             },
  { name: 'address',      label: 'Address',        placeholder: '123 MG Road, Mumbai'   },
  { name: 'industry',     label: 'Industry',       placeholder: 'Technology'            },
  { name: 'contactEmail', label: 'Contact Email',  type: 'email', placeholder: 'hr@acme.com' },
  { name: 'contactPhone', label: 'Contact Phone',  type: 'tel',   placeholder: '+91 98765 43210' },
  { name: 'logoUrl',      label: 'Logo URL',       type: 'url',   placeholder: 'https://example.com/logo.png' },
]

export function CompanyForm({ defaultValues, onSubmit, isPending }: CompanyFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formRef.current && defaultValues) {
      fields.forEach(({ name }) => {
        const input = formRef.current?.elements.namedItem(name) as HTMLInputElement
        if (input && defaultValues[name] !== undefined) {
          input.value = (defaultValues[name] as string) || ''
        }
      })
    }
  }, [defaultValues])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      name:         fd.get('name') as string,
      address:      fd.get('address') as string,
      industry:     fd.get('industry') as string,
      contactEmail: fd.get('contactEmail') as string,
      contactPhone: fd.get('contactPhone') as string,
      logoUrl:      fd.get('logoUrl') as string,
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, type = 'text', placeholder }) => (
          <div key={name} className="space-y-1.5">
            <label htmlFor={`co-${name}`} className="text-sm font-medium">{label}</label>
            <input
              id={`co-${name}`}
              name={name}
              type={type}
              placeholder={placeholder}
              defaultValue={defaultValues?.[name] ?? ''}
              className={fieldClass}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? 'Saving…' : 'Save Company Settings'}
        </button>
      </div>
    </form>
  )
}
