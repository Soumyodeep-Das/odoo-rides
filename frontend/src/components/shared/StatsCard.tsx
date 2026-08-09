import type { LucideIcon } from 'lucide-react'
import { cn } from '#lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  className?: string
  iconClassName?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  const trendUp = trend && trend.value >= 0

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            'rounded-xl p-3 bg-primary/10',
            iconClassName
          )}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className={cn(
              'px-1.5 py-0.5 rounded-full',
              trendUp
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-destructive/10 text-destructive'
            )}
          >
            {trendUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
