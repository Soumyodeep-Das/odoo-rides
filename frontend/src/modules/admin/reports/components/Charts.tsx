import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useRidesByDay, useDepartmentRides } from '../hooks'

// ── Rides-by-day chart ────────────────────────────────────────────────────────

const FALLBACK_RIDES_BY_DAY = Array.from({ length: 14 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (13 - i))
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    rides: Math.floor(Math.random() * 20 + 5),
    bookings: Math.floor(Math.random() * 40 + 10),
  }
})

const FALLBACK_DEPT = [
  { department: 'Engineering', rides: 42 },
  { department: 'Design',      rides: 28 },
  { department: 'Marketing',   rides: 19 },
  { department: 'HR',          rides: 13 },
  { department: 'Finance',     rides: 31 },
]

export function RidesTrendChart() {
  const { data, isLoading } = useRidesByDay(14)
  const chartData = data ?? FALLBACK_RIDES_BY_DAY

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Rides &amp; Bookings — Last 14 Days</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Daily trend of rides offered vs seats booked</p>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rides-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="bookings-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: 12,
              }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="rides"    name="Rides"    stroke="var(--color-primary)"  fill="url(#rides-grad)"    strokeWidth={2} />
            <Area type="monotone" dataKey="bookings" name="Bookings" stroke="var(--color-chart-2)"  fill="url(#bookings-grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function DepartmentRidesChart() {
  const { data, isLoading } = useDepartmentRides()
  const chartData = data ?? FALLBACK_DEPT

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Rides by Department</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Which teams use the carpool most</p>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="department" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: 12,
              }}
            />
            <Bar dataKey="rides" name="Rides" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
