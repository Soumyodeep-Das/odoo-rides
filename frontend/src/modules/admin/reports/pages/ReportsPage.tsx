import { SummaryCards } from '../components/SummaryCards'
import { RidesTrendChart, DepartmentRidesChart } from '../components/Charts'

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
        <div className="grid gap-6 lg:grid-cols-2">
          <RidesTrendChart />
          <DepartmentRidesChart />
        </div>
      </section>
    </div>
  )
}
