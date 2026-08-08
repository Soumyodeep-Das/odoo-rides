import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Loader } from '#components/shared/Loader'
import { RequireAuth, RequireAdmin, GuestOnly } from './guards'

// ── Auth pages ────────────────────────────────────────────────────────────────
const Login = lazy(() => import('#modules/auth/pages/Login'))
const Register = lazy(() => import('#modules/auth/pages/Register'))
const SetPassword = lazy(() => import('#modules/auth/pages/EmployeeOnboarding'))

// ── Employee pages ────────────────────────────────────────────────────────────
const EmpDashboard = lazy(() => import('#modules/dashboard/pages/EmployeeDashboardPage'))
const RideList = lazy(() => import('#modules/ride/pages/RideList'))
const CreateRide = lazy(() => import('#modules/ride/pages/CreateRide'))
const MyBookings = lazy(() => import('#modules/booking/pages/MyBookings'))
const RegisterVehicle = lazy(() => import('#modules/vehicle/pages/RegisterVehicle'))

const AddMoney = lazy(() => import('#modules/wallet/pages/AddMoney'))




// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLayout = lazy(() => import('#modules/admin/layout/AdminLayout'))
const AdminDashboard = lazy(() => import('#modules/admin/dashboard/pages/Dashboard'))
const EmployeesPage = lazy(() => import('#modules/admin/employees/pages/EmployeesPage'))
const VehiclesPage = lazy(() => import('#modules/admin/vehicles/pages/VehiclesPage'))
const SettingsPage = lazy(() => import('#modules/admin/settings/pages/SettingsPage'))
const ReportsPage = lazy(() => import('#modules/admin/reports/pages/ReportsPage'))

const router = createBrowserRouter([
  // ── Guest-only routes (redirect away if already logged in) ────────────────
  {
    element: (
      <Suspense fallback={<Loader />}>
        <GuestOnly />
      </Suspense>
    ),
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },

  // ── Employee invite — accessible without auth ─────────────────────────────
  {
    path: '/employee-onboard',
    element: (
      <Suspense fallback={<Loader />}>
        <SetPassword />
      </Suspense>
    ),
  },

  // ── Protected employee routes ─────────────────────────────────────────────
  {
    element: (
      <Suspense fallback={<Loader />}>
        <RequireAuth />
      </Suspense>
    ),
    children: [
      { path: '/', element: <EmpDashboard /> },
      { path: '/rides', element: <RideList /> },
      { path: '/rides/create', element: <CreateRide /> },
      { path: '/bookings', element: <MyBookings /> },
      { path: '/vehicles/register', element: <RegisterVehicle /> },
      { path: '/recharge', element: <AddMoney /> },
    ],
  },

  // ── Protected admin routes ────────────────────────────────────────────────
  {
    element: (
      <Suspense fallback={<Loader />}>
        <RequireAuth />
      </Suspense>
    ),
    children: [
      {
        element: <RequireAdmin />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: 'dashboard', element: <AdminDashboard /> },
              { path: 'employees', element: <EmployeesPage /> },
              { path: 'vehicles', element: <VehiclesPage /> },
              { path: 'reports', element: <ReportsPage /> },
              { path: 'settings', element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
