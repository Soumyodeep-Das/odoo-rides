import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Loader } from '#components/shared/Loader'

// ── Auth pages ────────────────────────────────────────────────────────────────
const Login    = lazy(() => import('#modules/auth/pages/Login'))
const Register = lazy(() => import('#modules/auth/pages/Register'))

// ── User-facing pages ─────────────────────────────────────────────────────────
const RideList    = lazy(() => import('#modules/ride/pages/RideList'))
const CreateRide  = lazy(() => import('#modules/ride/pages/CreateRide'))
const MyBookings  = lazy(() => import('#modules/booking/pages/MyBookings'))

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLayout   = lazy(() => import('#modules/admin/layout/AdminLayout'))
const Dashboard     = lazy(() => import('#modules/admin/dashboard/pages/Dashboard'))
const EmployeesPage = lazy(() => import('#modules/admin/employees/pages/EmployeesPage'))
const VehiclesPage  = lazy(() => import('#modules/admin/vehicles/pages/VehiclesPage'))
const SettingsPage  = lazy(() => import('#modules/admin/settings/pages/SettingsPage'))
const ReportsPage   = lazy(() => import('#modules/admin/reports/pages/ReportsPage'))

const router = createBrowserRouter([
  // ── User routes ──────────────────────────────────────────────────────────
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { index: true, element: <RideList /> },
      { path: 'rides/create', element: <CreateRide /> },
      { path: 'bookings',     element: <MyBookings /> },
      { path: 'login',        element: <Login /> },
      { path: 'register',     element: <Register /> },
    ],
  },

  // ── Admin routes ─────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loader />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'vehicles',  element: <VehiclesPage /> },
      { path: 'reports',   element: <ReportsPage /> },
      { path: 'settings',  element: <SettingsPage /> },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
