import { useRef } from 'react'
import { Modal } from '#components/shared/Modal'
import { useAddVehicle } from '../hooks'
import type { AddVehiclePayload } from '../types'

interface AddVehicleModalProps {
  open: boolean
  onClose: () => void
}

export function AddVehicleModal({ open, onClose }: AddVehicleModalProps) {
  const { mutate: add, isPending, error, reset } = useAddVehicle()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload: AddVehiclePayload = {
      make:         fd.get('make') as string,
      model:        fd.get('model') as string,
      year:         Number(fd.get('year')),
      licensePlate: fd.get('licensePlate') as string,
      ownerId:      fd.get('ownerId') as string,
      seats:        Number(fd.get('seats')),
    }
    add(payload, {
      onSuccess: () => { formRef.current?.reset(); reset(); onClose() },
    })
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Vehicle"
      description="Register a new vehicle for the carpool programme."
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'make',  label: 'Make',  placeholder: 'Toyota',     type: 'text'   },
            { id: 'model', label: 'Model', placeholder: 'Innova',     type: 'text'   },
            { id: 'year',  label: 'Year',  placeholder: '2022',       type: 'number' },
            { id: 'seats', label: 'Seats', placeholder: '4',          type: 'number' },
          ].map(({ id, label, placeholder, type }) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={`veh-${id}`} className="text-sm font-medium">{label}</label>
              <input id={`veh-${id}`} name={id} type={type} required min={type === 'number' ? 1 : undefined} placeholder={placeholder} className={fieldClass} />
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="veh-plate" className="text-sm font-medium">License Plate</label>
          <input id="veh-plate" name="licensePlate" type="text" required className={fieldClass} placeholder="MH 01 AB 1234" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="veh-owner" className="text-sm font-medium">Owner Employee ID</label>
          <input id="veh-owner" name="ownerId" type="text" required className={fieldClass} placeholder="emp_001" />
        </div>

        {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isPending ? 'Adding…' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
