import { Table, type Column } from '#components/shared/Table'
import { useVehicles, useUpdateVehicleStatus, useDeleteVehicle } from '../hooks'
import type { Vehicle } from '../types'
import { formatDate } from '#core/utils/helpers'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '#lib/utils'

const STATUS_BADGE: Record<Vehicle['status'], string> = {
  approved: 'bg-emerald-500/10 text-emerald-600',
  pending:  'bg-amber-500/10 text-amber-600',
  rejected: 'bg-destructive/10 text-destructive',
  inactive: 'bg-muted text-muted-foreground',
}

interface VehicleTableProps {
  search: string
}

export function VehicleTable({ search }: VehicleTableProps) {
  const { data: vehicles = [], isLoading } = useVehicles()
  const { mutate: updateStatus } = useUpdateVehicleStatus()
  const { mutate: remove } = useDeleteVehicle()

  const filtered = vehicles.filter((v) =>
    [v.make, v.model, v.licensePlate, v.ownerName]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const columns: Column<Vehicle>[] = [
    {
      key: 'make',
      header: 'Vehicle',
      render: (v) => (
        <div>
          <p className="font-medium">{v.make} {v.model} ({v.year})</p>
          <p className="text-xs text-muted-foreground">{v.licensePlate}</p>
        </div>
      ),
    },
    {
      key: 'ownerName',
      header: 'Owner',
      render: (v) => (
        <div>
          <p className="font-medium">{v.ownerName}</p>
          <p className="text-xs text-muted-foreground">ID: {v.ownerId}</p>
        </div>
      ),
    },
    { key: 'seats', header: 'Seats', render: (v) => `${v.seats} seats` },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_BADGE[v.status])}>
          {v.status}
        </span>
      ),
    },
    { key: 'registeredAt', header: 'Registered', render: (v) => formatDate(v.registeredAt) },
    {
      key: 'id',
      header: 'Actions',
      render: (v) => (
        <div className="flex items-center gap-1">
          {v.status === 'pending' && (
            <>
              <button
                onClick={() => updateStatus({ id: v.id, status: 'approved' })}
                title="Approve"
                className="rounded-lg p-1.5 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => updateStatus({ id: v.id, status: 'rejected' })}
                title="Reject"
                className="rounded-lg p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => remove(v.id)}
            title="Delete vehicle"
            className="rounded-lg p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={filtered}
      isLoading={isLoading}
      emptyMessage="No vehicles found."
    />
  )
}
