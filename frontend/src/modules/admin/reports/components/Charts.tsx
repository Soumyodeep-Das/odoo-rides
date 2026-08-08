import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useRidesByDay, useRideStatusBreakdown, useSeatUtilization } from '../hooks'
import type { RideStatusValue } from '../types'

// ── Shared tooltip style ──────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  background:   'var(--color-card)',
  border:       '1px solid var(--color-border)',
  borderRadius: '0.5rem',
  fontSize:     12,
}

// ── Chart skeleton ────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return <div className="h-64 rounded-xl bg-muted animate-pulse" />
}

// ── Chart card wrapper ────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

// ── 1. Rides & Bookings Trend ─────────────────────────────────────────────────

const FALLBACK_RIDES_BY_DAY = Array.from({ length: 14 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (13 - i))
  return {
    date:     d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    rides:    Math.floor(Math.random() * 20 + 5),
    bookings: Math.floor(Math.random() * 40 + 10),
  }
})

export function RidesTrendChart() {
  const { data, isLoading } = useRidesByDay(14)
  const chartData = data ?? FALLBACK_RIDES_BY_DAY

  return (
    <ChartCard
      title="Rides & Bookings — Last 14 Days"
      subtitle="Daily trend of rides offered vs seats booked"
    >
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rides-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--color-primary)"  stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)"  stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="bookings-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date"  tick={{ fontSize: 11 }} />
            <YAxis                 tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="rides"    name="Rides"    stroke="var(--color-primary)"  fill="url(#rides-grad)"    strokeWidth={2} />
            <Area type="monotone" dataKey="bookings" name="Bookings" stroke="var(--color-chart-2)"  fill="url(#bookings-grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

// ── 2. Ride Status Breakdown (Donut) ─────────────────────────────────────────

const STATUS_COLOURS: Record<RideStatusValue, string> = {
  active:    '#22c55e',   // green-500
  completed: '#6366f1',   // indigo-500
  full:      '#f59e0b',   // amber-500
  cancelled: '#ef4444',   // red-500
}

const FALLBACK_STATUS = [
  { status: 'completed' as RideStatusValue, count: 148 },
  { status: 'active'    as RideStatusValue, count:  52 },
  { status: 'full'      as RideStatusValue, count:  31 },
  { status: 'cancelled' as RideStatusValue, count:  17 },
]

// Custom label rendered inside the donut
function DonutLabel({
  cx, cy, total,
}: {
  cx: number
  cy: number
  total: number
}) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.4em" fontSize={22} fontWeight={700} fill="var(--color-foreground)">
        {total}
      </tspan>
      <tspan x={cx} dy="1.5em" fontSize={11} fill="var(--color-muted-foreground)">
        total rides
      </tspan>
    </text>
  )
}

export function RideStatusChart() {
  const { data, isLoading } = useRideStatusBreakdown()
  const chartData = data ?? FALLBACK_STATUS
  const total = chartData.reduce((s, d) => s + d.count, 0)

  return (
    <ChartCard
      title="Ride Status Breakdown"
      subtitle="Distribution of rides by current status"
    >
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={106}
              paddingAngle={3}
              strokeWidth={0}
              label={false}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLOURS[entry.status]}
                />
              ))}
              {/* Centred total label — drawn via Recharts' customised label prop on Pie, but
                  recharts doesn't support ReactNode there cleanly; use a plain SVG text trick */}
            </Pie>

            {/* Centred label using a second, invisible zero-size Pie as a position anchor */}
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={0}
              dataKey="value"
              label={({ cx, cy }) => <DonutLabel cx={cx} cy={cy} total={total} />}
              labelLine={false}
            >
              <Cell fill="transparent" />
            </Pie>

            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: number, name: string) => [
                `${value} rides (${Math.round((value / total) * 100)}%)`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

// ── 3. Seat Utilisation Rate (Stacked Bar) ────────────────────────────────────

const FALLBACK_SEATS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (13 - i))
  const available = Math.floor(Math.random() * 60 + 20)
  const booked    = Math.floor(Math.random() * available * 0.9)
  return {
    date:           d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    availableSeats: available,
    bookedSeats:    booked,
  }
})

// Custom tooltip showing utilisation %
function SeatTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const booked    = payload.find((p) => p.name === 'Booked')?.value    ?? 0
  const available = payload.find((p) => p.name === 'Available')?.value ?? 0
  const total     = booked + available
  const pct       = total > 0 ? Math.round((booked / total) * 100) : 0

  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2">
      <p className="text-xs font-semibold mb-1">{label}</p>
      <p className="text-xs text-muted-foreground">Booked: <span className="text-foreground font-medium">{booked}</span></p>
      <p className="text-xs text-muted-foreground">Available: <span className="text-foreground font-medium">{available}</span></p>
      <p className="text-xs font-semibold mt-1 text-primary">Utilisation: {pct}%</p>
    </div>
  )
}

export function SeatUtilizationChart() {
  const { data, isLoading } = useSeatUtilization(14)
  const chartData = data ?? FALLBACK_SEATS

  return (
    <ChartCard
      title="Seat Utilisation — Last 14 Days"
      subtitle="Booked vs available seats per day (higher booked = better carpool efficiency)"
    >
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date"  tick={{ fontSize: 11 }} />
            <YAxis                 tick={{ fontSize: 11 }} />
            <Tooltip content={<SeatTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="bookedSeats"    name="Booked"    stackId="seats" fill="#6366f1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="availableSeats" name="Available" stackId="seats" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
