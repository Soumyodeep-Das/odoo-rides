import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Loader } from '#components/shared/Loader'

// Lazy-loaded pages
const Login = lazy(() => import('#modules/auth/pages/Login'))
const Register = lazy(() => import('#modules/auth/pages/Register'))
const Dashboard = lazy(() => import('#modules/dashboard/pages/EmployeeDashboardPage'))
const RideList = lazy(() => import('#modules/ride/pages/RideList'))
const CreateRide = lazy(() => import('#modules/ride/pages/CreateRide'))
const MyBookings = lazy(() => import('#modules/booking/pages/MyBookings'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'rides', element: <RideList /> },
      { path: 'rides/create', element: <CreateRide /> },
      { path: 'bookings', element: <MyBookings /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
