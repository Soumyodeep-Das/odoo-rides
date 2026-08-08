export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN:            '/auth/login',
    ONBOARD:          '/admin/onboarding',
    EMPLOYEE_ONBOARD: '/auth/employee-onboard',
    ME:               '/auth/me',
  },

  // Rides
  RIDES: {
    LIST: '/rides',
    CREATE: '/rides',
    DETAIL: (id: string | number) => `/rides/${id}`,
    UPDATE: (id: string | number) => `/rides/${id}`,
    DELETE: (id: string | number) => `/rides/${id}`,
  },

  // Bookings (nested under rides on the backend)
  BOOKINGS: {
    /** GET /rides/my-rides/passenger/:passengerId */
    PASSENGER: (passengerId: string) => `/rides/my-rides/passenger/${passengerId}`,
    /** POST /rides/:rideId/book */
    BOOK: (rideId: string) => `/rides/${rideId}/book`,
    /** POST /rides/:rideId/bookings/:bookingId/cancel */
    CANCEL: (rideId: string, bookingId: string) => `/rides/${rideId}/bookings/${bookingId}/cancel`,
    /** GET /rides/:rideId/bookings */
    RIDE_BOOKINGS: (rideId: string) => `/rides/${rideId}/bookings`,
  },

  // Vehicles (employee self-service)
  VEHICLES: {
    MINE: '/vehicles/mine',
  },

  // Wallet
  WALLET: {
    GET: (userId: string) => `/wallet/${userId}`,
    CREATE_RECHARGE: '/wallet/recharge/create-order',
    VERIFY_RECHARGE: '/wallet/recharge/verify',
  },

  // Admin — Employees
  ADMIN_EMPLOYEES: {
    LIST: '/admin/employees',
    CREATE: '/admin/employees',
    TOGGLE_ACCESS: (id: string) => `/admin/employees/${id}/access`,
    DELETE: (id: string) => `/admin/employees/${id}`,
  },

  // Admin — Vehicles
  ADMIN_VEHICLES: {
    LIST: '/admin/vehicles',
    CREATE: '/admin/vehicles',
    UPDATE_STATUS: (id: string) => `/admin/vehicles/${id}/status`,
    DELETE: (id: string) => `/admin/vehicles/${id}`,
  },

  // Admin — Settings
  ADMIN_SETTINGS: {
    GET: '/admin/settings',
    COMPANY: '/admin/settings/company',
    CARPOOL: '/admin/settings/carpool',
  },

  // Admin — Reports
  ADMIN_REPORTS: {
    SUMMARY: '/admin/reports/summary',
    RIDES_BY_DAY: '/admin/reports/rides-by-day',
    DEPT_RIDES: '/admin/reports/department-rides',
  },
} as const
