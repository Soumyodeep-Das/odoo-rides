import { StatsOverview } from '../components/StatsOverview'
import { RidesTrendChart } from '#modules/admin/reports/components/Charts'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 to-transparent p-6">
        <h2 className="text-xl font-bold">Welcome back, Admin </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your carpool programme today.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: 'Manage Employees', to: '/admin/employees' },
            { label: 'View Vehicles', to: '/admin/vehicles' },
            { label: 'Full Reports', to: '/admin/reports' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Live stats */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Overview</h3>
        <StatsOverview />
      </section>

      {/* Trend chart */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ride Trend</h3>
        <RidesTrendChart />
      </section>
    </div>
  )
}
