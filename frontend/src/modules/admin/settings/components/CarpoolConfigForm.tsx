import type { CarpoolConfig } from '../types'

interface CarpoolConfigFormProps {
  defaultValues?: Partial<CarpoolConfig>
  onSubmit: (data: CarpoolConfig) => void
  isPending?: boolean
}

const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all'

const fields: { name: keyof CarpoolConfig; label: string; unit: string; placeholder: string; min: number; step: string }[] = [
  { name: 'fuelCostPerLitre',       label: 'Fuel Cost per Litre',         unit: '₹',   placeholder: '90',    min: 0, step: '0.01' },
  { name: 'costPerKm',              label: 'Cost per KM',                 unit: '₹',   placeholder: '4.5',   min: 0, step: '0.01' },
  { name: 'travelAllowancePerKm',   label: 'Travel Allowance per KM',     unit: '₹',   placeholder: '3',     min: 0, step: '0.01' },
  { name: 'maxSeatsPerRide',        label: 'Max Seats per Ride',          unit: 'seats', placeholder: '4',   min: 1, step: '1'    },
  { name: 'bookingCutoffMinutes',   label: 'Booking Cutoff',              unit: 'mins', placeholder: '30',   min: 0, step: '1'    },
]

export function CarpoolConfigForm({ defaultValues, onSubmit, isPending }: CarpoolConfigFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSubmit({
      fuelCostPerLitre:      Number(fd.get('fuelCostPerLitre')),
      costPerKm:             Number(fd.get('costPerKm')),
      travelAllowancePerKm:  Number(fd.get('travelAllowancePerKm')),
      maxSeatsPerRide:       Number(fd.get('maxSeatsPerRide')),
      bookingCutoffMinutes:  Number(fd.get('bookingCutoffMinutes')),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, unit, placeholder, min, step }) => (
          <div key={name} className="space-y-1.5">
            <label htmlFor={`cp-${name}`} className="text-sm font-medium">
              {label}
              <span className="ml-1 text-xs text-muted-foreground">({unit})</span>
            </label>
            <input
              id={`cp-${name}`}
              name={name}
              type="number"
              min={min}
              step={step}
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
          {isPending ? 'Saving…' : 'Save Carpool Config'}
        </button>
      </div>
    </form>
  )
}
