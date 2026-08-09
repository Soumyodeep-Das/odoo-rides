import { useState } from 'react'
import { PlusCircle, Search } from 'lucide-react'
import { VehicleTable } from '../components/VehicleTable'
import { AddVehicleModal } from '../components/AddVehicleModal'

export default function VehiclesPage() {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Fleet Management</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Vehicles</h2>
            <p className="mt-2 text-muted-foreground">Approve, reject, and manage registered vehicles</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search vehicles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[280px] rounded-xl border border-input bg-card pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              Add Vehicle
            </button>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <VehicleTable search={search} />
        </div>
      </section>

      {/* Modal */}
      <AddVehicleModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
