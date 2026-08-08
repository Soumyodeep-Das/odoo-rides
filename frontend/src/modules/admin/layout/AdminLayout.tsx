import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '#components/shared/Sidebar'
import { AdminNavbar } from '#components/shared/AdminNavbar'

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/employees': 'Employees',
  '/admin/vehicles':  'Vehicles',
  '/admin/reports':   'Reports',
  '/admin/settings':  'Settings',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Admin'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
