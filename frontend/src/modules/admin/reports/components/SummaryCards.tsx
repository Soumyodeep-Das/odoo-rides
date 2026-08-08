import { Leaf, Fuel, IndianRupee, Route, Info } from 'lucide-react'
import { StatsCard } from '#components/shared/StatsCard'
import { useReportSummary } from '../hooks'
import type { ReportSummary } from '../types'

// ── Fallback data (shown when API is unavailable) ──────────────────────────────

const FALLBACK: ReportSummary = {
  totalRides:     248,
  totalEmployees: 62,
  totalVehicles:  18,
  totalBookings:  594,
  co2Saved:       1240,
  fuelSaved:      520,
  costSaved:      46800,
}

// ── Card definitions ──────────────────────────────────────────────────────────

interface CardDef {
  title:         string
  value:         string | number
  subtitle:      string
  icon:          typeof Leaf
  iconClassName: string
  formula:       string[]   // each string is one line in the tooltip
}

function buildCards(d: ReportSummary): CardDef[] {
  return [
    {
      title:         'CO₂ Saved',
      value:         `${d.co2Saved} kg`,
      subtitle:      'vs individual commuting',
      icon:          Leaf,
      iconClassName: 'bg-emerald-500/10',
      formula: [
        'seats_booked × distance_km × 0.21 kg/km',
        `= ${d.totalBookings} seats × avg km × 0.21`,
        `= ${d.co2Saved} kg CO₂ avoided`,
        '',
        '0.21 kg/km = IPCC avg car emission factor',
      ],
    },
    {
      title:         'Fuel Saved',
      value:         `${d.fuelSaved} L`,
      subtitle:      'combined across all rides',
      icon:          Fuel,
      iconClassName: 'bg-blue-500/10',
      formula: [
        'cost_saved ÷ fuel_cost_per_litre',
        `= ₹${d.costSaved.toLocaleString('en-IN')} ÷ ₹90/L`,
        `≈ ${d.fuelSaved} litres`,
        '',
        'fuel_cost_per_litre set in Settings → Carpool Config',
      ],
    },
    {
      title:         'Cost Saved',
      value:         `₹${d.costSaved.toLocaleString('en-IN')}`,
      subtitle:      'employee travel reimbursement',
      icon:          IndianRupee,
      iconClassName: 'bg-amber-500/10',
      formula: [
        'SUM(seats_booked × distance_km × allowance/km)',
        `= ${d.totalBookings} bookings × avg km × ₹3/km`,
        `= ₹${d.costSaved.toLocaleString('en-IN')}`,
        '',
        'allowance/km configured in Settings → Carpool Config',
      ],
    },
    {
      title:         'Total Rides',
      value:         d.totalRides,
      subtitle:      `${d.totalBookings} bookings made`,
      icon:          Route,
      iconClassName: 'bg-violet-500/10',
      formula: [
        'COUNT(rides) WHERE status ≠ cancelled',
        `= ${d.totalRides} rides completed`,
        '',
        `Total seats filled: ${d.totalBookings}`,
        `Avg seats/ride: ${(d.totalBookings / Math.max(d.totalRides, 1)).toFixed(1)}`,
      ],
    },
  ]
}

// ── Tooltip-wrapped card ──────────────────────────────────────────────────────

function FormulaCard({ card }: { card: CardDef }) {
  return (
    <div className="group relative">
      <StatsCard
        title={card.title}
        value={card.value}
        subtitle={card.subtitle}
        icon={card.icon}
        iconClassName={card.iconClassName}
      />

      {/* Hover trigger indicator */}
      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Info className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Tooltip */}
      <div
        className={[
          // positioning — try to float above, fall back handled by overflow-visible on parent
          'absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-50 w-64',
          // visibility & animation
          'pointer-events-none opacity-0 translate-y-1',
          'group-hover:opacity-100 group-hover:translate-y-0',
          'transition-all duration-200 ease-out',
          // look
          'rounded-xl border border-border bg-popover shadow-xl px-4 py-3',
        ].join(' ')}
        role="tooltip"
      >
        {/* Arrow */}
        <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 rounded-[2px] border-b border-r border-border bg-popover" />

        <p className="mb-2 text-xs font-semibold text-foreground">How it's calculated</p>
        <div className="space-y-0.5">
          {card.formula.map((line, i) =>
            line === '' ? (
              <div key={i} className="h-2" />
            ) : (
              <p
                key={i}
                className={[
                  'text-[11px] font-mono leading-snug',
                  i === 0 ? 'text-primary font-semibold' : 'text-muted-foreground',
                ].join(' ')}
              >
                {line}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  )
}

// ── Public component ──────────────────────────────────────────────────────────

export function SummaryCards() {
  const { data: s, isLoading } = useReportSummary()
  const d = s ?? (isLoading ? null : FALLBACK)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl border border-border bg-card animate-pulse" />
        ))}
      </div>
    )
  }

  if (!d) return null

  const cards = buildCards(d)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 overflow-visible">
      {cards.map((card) => (
        <FormulaCard key={card.title} card={card} />
      ))}
    </div>
  )
}
