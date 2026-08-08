import { SummaryCards } from '../components/SummaryCards'
import {
  RidesTrendChart,
  RideStatusChart,
  SeatUtilizationChart,
} from '../components/Charts'

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold">Reports</h2>
        <p className="text-sm text-muted-foreground">
          Environmental impact, savings, and ride analytics
        </p>
      </div>

      {/* Eco + financial summary */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Impact Summary
        </h3>
        <SummaryCards />
      </section>

      {/* Charts */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Analytics
        </h3>
        {/* Row 1 — trend takes full width on large screens, status takes half */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RidesTrendChart />
          <RideStatusChart />
        </div>

        {/* Row 2 — seat utilisation spans full width for readability */}
        <div className="mt-6">
          <SeatUtilizationChart />
        </div>
      </section>
    </div>
  )
}
