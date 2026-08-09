import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '#core/hooks/useAuth'
import { Button } from '#components/ui/button'
import { APP_NAME } from '#core/config/env'

export function Navbar() {
  const { isAuthenticated, setToken } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="text-lg font-semibold text-primary">
          {APP_NAME}
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-sm hover:text-primary transition-colors">
                Rides
              </Link>
              <Link to="/rides/create" className="text-sm hover:text-primary transition-colors">
                Offer Ride
              </Link>
              <Link to="/bookings" className="text-sm hover:text-primary transition-colors">
                My Bookings
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
