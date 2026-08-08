import { createContext, useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ── Auth Context ──────────────────────────────────────────────────────────────

interface AuthContextValue {
  token: string | null
  setToken: (token: string | null) => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

// ── QueryClient ───────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// ── Providers ─────────────────────────────────────────────────────────────────

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken)
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext value={{ token, setToken: handleSetToken, isAuthenticated: !!token }}>
        {children}
      </AuthContext>
    </QueryClientProvider>
  )
}
