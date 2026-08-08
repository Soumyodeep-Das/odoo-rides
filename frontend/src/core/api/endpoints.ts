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
} as const
