import { Users, Car, CalendarCheck, BookOpen } from 'lucide-react'
import { StatsCard } from '#components/shared/StatsCard'
import { useEmployees } from '#modules/admin/employees/hooks'
import { useVehicles } from '#modules/admin/vehicles/hooks'

export function StatsOverview() {
  const { data: employees = [], isLoading: empLoading } = useEmployees()
  const { data: vehicles  = [], isLoading: vehLoading  } = useVehicles()

  const activeEmp = employees.filter((e) => e.status === 'active').length
  const approvedVeh = vehicles.filter((v) => v.status === 'approved').length
  const pendingVeh  = vehicles.filter((v) => v.status === 'pending').length

  const isLoading = empLoading || vehLoading

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
      <StatsCard
        title="Total Employees"
        value={employees.length}
        subtitle={`${activeEmp} active`}
        icon={Users}
        trend={{ value: 8, label: 'vs last month' }}
        iconClassName="bg-blue-500/10"
      />
      <StatsCard
        title="Total Vehicles"
        value={vehicles.length}
        subtitle={`${approvedVeh} approved · ${pendingVeh} pending`}
        icon={Car}
        trend={{ value: 5, label: 'vs last month' }}
        iconClassName="bg-violet-500/10"
      />
      <StatsCard
        title="Rides Today"
        value={24}
        subtitle="across all routes"
        icon={CalendarCheck}
        trend={{ value: 12, label: 'vs yesterday' }}
        iconClassName="bg-emerald-500/10"
      />
      <StatsCard
        title="Active Bookings"
        value={87}
        subtitle="pending confirmation"
        icon={BookOpen}
        trend={{ value: -3, label: 'vs yesterday' }}
        iconClassName="bg-amber-500/10"
      />
    </div>
  )
}
