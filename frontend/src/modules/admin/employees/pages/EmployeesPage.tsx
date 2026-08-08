import { useState } from 'react'
import { UserPlus, Search } from 'lucide-react'
import { EmployeeTable } from '../components/EmployeeTable'
import { AddEmployeeModal } from '../components/AddEmployeeModal'

export default function EmployeesPage() {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Employees</h2>
          <p className="text-sm text-muted-foreground">Manage employee access and roles</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search employees…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Table */}
      <EmployeeTable search={search} />

      {/* Modal */}
      <AddEmployeeModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
