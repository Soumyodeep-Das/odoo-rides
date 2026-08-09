import { SummaryCards } from '../components/SummaryCards'
import {
  RidesTrendChart,
  RideStatusChart,
  SeatUtilizationChart,
} from '../components/Charts'

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Company Analytics</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Reports</h2>
            <p className="mt-2 text-muted-foreground">Environmental impact, savings, and ride analytics</p>
          </div>
        </div>
      </section>

      {/* Eco + financial summary */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Impact Summary
          </h3>
        </div>
        <SummaryCards />
      </section>

      {/* Charts */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Analytics
          </h3>
        </div>
        
        {/* Row 1 — trend takes full width on large screens, status takes half */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <RidesTrendChart />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <RideStatusChart />
          </div>
        </div>

        {/* Row 2 — seat utilisation spans full width for readability */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <SeatUtilizationChart />
        </div>
      </section>
    </div>
  )
}
