import { useState } from 'react'
import { Bell, Check, X, Car } from 'lucide-react'
import { Modal } from '#components/shared/Modal'
import { useVehicles, useUpdateVehicleStatus } from '#modules/admin/vehicles/hooks'

export function AdminNotifications() {
  const [open, setOpen] = useState(false)
  const { data: vehicles = [], isLoading } = useVehicles()
  const { mutate: updateStatus, isPending } = useUpdateVehicleStatus()

  const pendingVehicles = vehicles.filter(v => v.status === 'pending')
  const count = pendingVehicles.length

  const handleApprove = (id: string) => {
    updateStatus({ id, status: 'approved' })
  }

  const handleReject = (id: string) => {
    updateStatus({ id, status: 'rejected' })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors bg-card shadow-sm"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Pending Vehicle Approvals"
        description="Review and approve vehicles registered by employees."
        size="lg"
      >
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : count === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No pending vehicle registrations.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {pendingVehicles.map(vehicle => (
              <div key={vehicle.id} className="flex items-center justify-between rounded-xl border border-border p-4 bg-card">
                <div>
                  <h4 className="font-semibold">{vehicle.make} {vehicle.model}</h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{vehicle.licensePlate}</span>
                    <span>•</span>
                    <span>{vehicle.year}</span>
                    <span>•</span>
                    <span>{vehicle.seats} seats</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Owner ID: {vehicle.ownerId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(vehicle.id)}
                    disabled={isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleApprove(vehicle.id)}
                    disabled={isPending}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}
