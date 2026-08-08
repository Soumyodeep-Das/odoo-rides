import { useContext } from 'react'
import { AuthContext } from '#app/providers'

/**
 * Access the auth context from anywhere in the app.
 * Must be used inside <Providers />.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within <Providers />')
  }
  return ctx
}
