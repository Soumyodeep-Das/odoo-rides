import { Outlet, Link, useNavigate } from 'react-router-dom'
import { UpdatedNavBar } from '#components/shared/UpdatedNavBar'
import { AdminNotifications } from '#components/shared/AdminNotifications'
import { useAuth } from '#core/hooks/useAuth'
import { Car, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const { user, clearAuth } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }
  
  const currentTime = new Date()
  const currentHour = currentTime.getHours()
  let greeting = "Good Evening"
  if (currentHour < 12) {
      greeting = "Good Morning"
  } else if (currentHour < 18) {
      greeting = "Good Afternoon"
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8 mt-4">
              <div>
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight">Odoo Rıdes<span className="text-primary animate-drive-swoosh inline-block">.</span></h1>
                </div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Welcome back</div>
                <h2 className="text-2xl font-bold mt-1 whitespace-nowrap">{greeting}, <span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span></h2>
              </div>

              <div className="flex lg:justify-end mb-4 lg:mb-0 gap-3">
                 <AdminNotifications />
                 <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/10 transition-colors bg-primary/5">
                   <Car className="h-5 w-5" />
                   Ride Mode
                 </Link>
                 <button 
                   onClick={handleLogout}
                   className="inline-flex items-center gap-2 rounded-lg border border-destructive/20 text-destructive px-4 py-2 text-sm font-semibold hover:bg-destructive/10 transition-colors bg-destructive/5"
                 >
                   <LogOut className="h-5 w-5" />
                   Log Out
                 </button>
              </div>
            </div>
            <UpdatedNavBar />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
