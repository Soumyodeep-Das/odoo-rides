import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '#core/hooks/useAuth'

/** Redirects unauthenticated users to /login */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Outlet />
}

/** Redirects non-admins to / */
export function RequireAdmin() {
  const { user } = useAuth()
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

/** Redirects authenticated users away from login/register */
export function GuestOnly() {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/'} replace />
  }
  return <Outlet />
}
