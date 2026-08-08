export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  // Rides
  RIDES: {
    LIST: '/rides',
    CREATE: '/rides',
    DETAIL: (id: string | number) => `/rides/${id}`,
    UPDATE: (id: string | number) => `/rides/${id}`,
    DELETE: (id: string | number) => `/rides/${id}`,
  },

  // Bookings
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    DETAIL: (id: string | number) => `/bookings/${id}`,
    CANCEL: (id: string | number) => `/bookings/${id}/cancel`,
  },

  // Admin — Employees
  ADMIN_EMPLOYEES: {
    LIST:          '/admin/employees',
    CREATE:        '/admin/employees',
    TOGGLE_ACCESS: (id: string) => `/admin/employees/${id}/access`,
    DELETE:        (id: string) => `/admin/employees/${id}`,
  },

  // Admin — Vehicles
  ADMIN_VEHICLES: {
    LIST:          '/admin/vehicles',
    CREATE:        '/admin/vehicles',
    UPDATE_STATUS: (id: string) => `/admin/vehicles/${id}/status`,
    DELETE:        (id: string) => `/admin/vehicles/${id}`,
  },

  // Admin — Settings
  ADMIN_SETTINGS: {
    GET:     '/admin/settings',
    COMPANY: '/admin/settings/company',
    CARPOOL: '/admin/settings/carpool',
  },

  // Admin — Reports
  ADMIN_REPORTS: {
    SUMMARY:      '/admin/reports/summary',
    RIDES_BY_DAY: '/admin/reports/rides-by-day',
    DEPT_RIDES:   '/admin/reports/department-rides',
  },
} as const
