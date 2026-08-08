import { Bell, Moon, Sun, Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '#lib/utils'
import { useAuth } from '#core/hooks/useAuth'

interface AdminNavbarProps {
  title?: string
}

export function AdminNavbar({ title }: AdminNavbarProps) {
  const { user } = useAuth()
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }

  // Build initials from user name
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur">
      {/* Left */}
      <div className="flex items-center gap-3">
        {title && <h1 className="text-base font-semibold">{title}</h1>}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search…"
            className={cn(
              'h-8 w-52 rounded-lg border border-input bg-background pl-8 pr-3 text-sm',
              'outline-none focus:ring-2 focus:ring-ring transition-all'
            )}
          />
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Avatar with real initials + tooltip */}
        <div className="group relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold select-none cursor-default">
            {initials}
          </div>
          {/* Tooltip */}
          {user && (
            <div className="pointer-events-none absolute right-0 top-10 z-50 hidden group-hover:block">
              <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs whitespace-nowrap">
                <p className="font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-primary mt-0.5 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
