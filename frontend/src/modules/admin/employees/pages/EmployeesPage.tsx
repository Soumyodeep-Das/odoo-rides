import { useState } from 'react'
import { UserPlus, Search } from 'lucide-react'
import { EmployeeTable } from '../components/EmployeeTable'
import { AddEmployeeModal } from '../components/AddEmployeeModal'

export default function EmployeesPage() {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">User Directory</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Employees</h2>
            <p className="mt-2 text-muted-foreground">Manage employee access and roles</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search employees…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[280px] rounded-xl border border-input bg-card pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              <UserPlus className="h-5 w-5" />
              Add Employee
            </button>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <EmployeeTable search={search} />
        </div>
      </section>

      {/* Modal */}
      <AddEmployeeModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
