import { Leaf, Fuel, IndianRupee, Route } from 'lucide-react'
import { StatsCard } from '#components/shared/StatsCard'
import { useReportSummary } from '../hooks'

const FALLBACK = {
  totalRides: 248,
  totalEmployees: 62,
  totalVehicles: 18,
  totalBookings: 594,
  co2Saved: 1240,
  fuelSaved: 520,
  costSaved: 46800,
}

export function SummaryCards() {
  const { data: s, isLoading } = useReportSummary()
  const d = s ?? (isLoading ? null : FALLBACK)

  const cards = d
    ? [
        { title: 'CO₂ Saved',     value: `${d.co2Saved} kg`,    icon: Leaf,          iconClassName: 'bg-emerald-500/10', subtitle: 'vs individual commuting' },
        { title: 'Fuel Saved',    value: `${d.fuelSaved} L`,    icon: Fuel,          iconClassName: 'bg-blue-500/10',    subtitle: 'combined across all rides' },
        { title: 'Cost Saved',    value: `₹${d.costSaved.toLocaleString('en-IN')}`, icon: IndianRupee, iconClassName: 'bg-amber-500/10', subtitle: 'employee travel reimbursement' },
        { title: 'Total Rides',   value: d.totalRides,           icon: Route,         iconClassName: 'bg-violet-500/10',  subtitle: `${d.totalBookings} bookings made` },
      ]
    : []

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl border border-border bg-card animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <StatsCard
          key={c.title}
          title={c.title}
          value={c.value}
          subtitle={c.subtitle}
          icon={c.icon}
          iconClassName={c.iconClassName}
        />
      ))}
    </div>
  )
}
