import { StatsOverview } from '../components/StatsOverview'
import { RidesTrendChart } from '#modules/admin/reports/components/Charts'

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">


      {/* Live stats */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Live Statistics</h3>
        </div>
        <StatsOverview />
      </section>

      {/* Trend chart */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ride Trend</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <RidesTrendChart />
        </div>
      </section>
    </div>
  )
}
