import { useState } from 'react'
import { Table, type Column } from '#components/shared/Table'
import { useEmployees, useToggleEmployeeAccess, useDeleteEmployee } from '../hooks'
import type { Employee } from '../types'
import { formatDate } from '#core/utils/helpers'
import { Trash2, ShieldCheck, ShieldOff } from 'lucide-react'
import { cn } from '#lib/utils'

const STATUS_BADGE: Record<Employee['status'], string> = {
  active:  'bg-emerald-500/10 text-emerald-600',
  revoked: 'bg-destructive/10 text-destructive',
}

const ROLE_BADGE: Record<Employee['role'], string> = {
  employee:  'bg-blue-500/10 text-blue-600',
  admin:     'bg-amber-500/10 text-amber-600',
}

export function EmployeeTable({ search }: { search: string }) {
  const { data: employees = [], isLoading } = useEmployees()
  const { mutate: toggle } = useToggleEmployeeAccess()
  const { mutate: remove } = useDeleteEmployee()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = employees.filter((e) =>
    [e.name, e.email]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      render: (e) => (
        <div>
          <p className="font-medium">{e.name}</p>
          <p className="text-xs text-muted-foreground">{e.email}</p>
        </div>
      ),
    },
    {
      key: 'empId',
      header: 'Employee ID',
      render: (e) => e.id,
    },
    // { key: 'department', header: 'Department' },
    // { key: 'manager',    header: 'Manager',    render: (e) => e.manager ?? '—' },
    // { key: 'location',   header: 'Location' },
    {
      key: 'role',
      header: 'Role',
      render: (e) => (
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', ROLE_BADGE[e.role])}>
          {e.role}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_BADGE[e.status])}>
          {e.status}
        </span>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (e) => formatDate(e.joinedAt),
    },
    {
      key: 'id',
      header: 'Actions',
      render: (e) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggle(e.id)}
            title={e.status === 'active' ? 'Revoke access' : 'Grant access'}
            className="rounded-lg p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            {e.status === 'active' ? (
              <ShieldOff className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            )}
          </button>
          <button
            onClick={() => {
              setDeletingId(e.id)
              remove(e.id, { onSettled: () => setDeletingId(null) })
            }}
            disabled={deletingId === e.id}
            title="Delete employee"
            className="rounded-lg p-1.5 hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
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
      emptyMessage="No employees found."
    />
  )
}
