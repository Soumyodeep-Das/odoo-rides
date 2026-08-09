import { useRef } from 'react'
import { Modal } from '#components/shared/Modal'
import { useAddEmployee } from '../hooks'
import type { AddEmployeePayload, EmployeeRole } from '../types'

interface AddEmployeeModalProps {
  open: boolean
  onClose: () => void
}

const ROLES: EmployeeRole[] = ['employee', 'admin']

export function AddEmployeeModal({ open, onClose }: AddEmployeeModalProps) {
  const { mutate: add, isPending, error, reset } = useAddEmployee()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload: AddEmployeePayload = {
      name:       fd.get('name') as string,
      email:      fd.get('email') as string,
      // department: fd.get('department') as string,
      role:       fd.get('role') as EmployeeRole,
      // location:   (fd.get('location') as string) || undefined,
    }
    add(payload, {
      onSuccess: () => {
        formRef.current?.reset()
        reset()
        onClose()
      },
    })
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Employee"
      description="Fill in the details to onboard a new employee."
    >
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="emp-name" className="text-sm font-medium">Full Name</label>
            <input id="emp-name" name="name" type="text" required className={fieldClass} placeholder="Jane Smith" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="emp-email" className="text-sm font-medium">Email</label>
            <input id="emp-email" name="email" type="email" required className={fieldClass} placeholder="jane@acme.com" />
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="emp-dept" className="text-sm font-medium">Department</label>
            <input id="emp-dept" name="department" type="text" required className={fieldClass} placeholder="Engineering" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="emp-location" className="text-sm font-medium">Location</label>
            <input id="emp-location" name="location" type="text" className={fieldClass} placeholder="Mumbai" />
          </div>
        </div> */}

        <div className="space-y-1.5">
          <label htmlFor="emp-role" className="text-sm font-medium">Role</label>
          <select id="emp-role" name="role" required className={fieldClass}>
            {ROLES.map((r) => (
              <option key={r} value={r} className="capitalize">{r}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isPending ? 'Adding…' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
