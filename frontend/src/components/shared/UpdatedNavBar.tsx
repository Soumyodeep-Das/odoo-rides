import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '#lib/utils'

export function UpdatedNavBar() {
  const { pathname } = useLocation()

  return (
    <nav className="mx-auto max-w-6xl space-y-12 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Dashboard', to: '/admin/dashboard', desc: 'Mission control' },
          { label: 'Employees', to: '/admin/employees', desc: 'Manage access' },
          { label: 'Vehicles', to: '/admin/vehicles', desc: 'Approve registrations' },
          { label: 'Reports', to: '/admin/reports', desc: 'View analytics' },
          { label: 'Settings', to: '/admin/settings', desc: 'Configure system' },
        ].map(({ label, to, desc }) => {
          const isActive = pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "rounded-2xl border p-4 transition-all group flex flex-col justify-between",
                isActive 
                  ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20" 
                  : "border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              <div>
                <div className="font-semibold text-sm sm:text-base flex items-center justify-between">
                  {label}
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </div>
                <div className={cn(
                  "text-xs mt-1 hidden sm:block",
                  isActive ? "text-primary/80" : "text-muted-foreground"
                )}>{desc}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}