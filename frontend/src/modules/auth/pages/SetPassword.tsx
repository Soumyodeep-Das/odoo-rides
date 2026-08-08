import { useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useSetPassword } from '../hooks'

export default function SetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { mutate: doSetPassword, isPending, error, isSuccess } = useSetPassword()

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-all duration-300'

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This invite link is missing or malformed.">
        <p className="text-sm text-muted-foreground text-center">
          Please contact your admin to resend the invitation.
        </p>
      </AuthLayout>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm = form.get('confirm') as string

    if (password !== confirm) {
      alert('Passwords do not match')
      return
    }
    doSetPassword({ token, password })
  }

  return (
    <AuthLayout
      title="Set your password"
      subtitle="Welcome to OdooRides — choose a password to activate your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">New password</label>
          <input id="password" name="password" type="password" required minLength={8}
            placeholder="Min. 8 characters" className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm" className="text-sm font-medium">Confirm password</label>
          <input id="confirm" name="confirm" type="password" required minLength={8}
            placeholder="Repeat your password" className={inputClass} />
        </div>

        {error && (
          <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
            {(error as Error).message}
          </div>
        )}

        {isSuccess && (
          <div className="p-3 text-sm rounded-md bg-green-500/15 text-green-700 border border-green-500/20">
            Password set! Redirecting…
          </div>
        )}

        <button type="submit" disabled={isPending || isSuccess}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 w-full hover:scale-[1.01] active:scale-[0.99] duration-300">
          {isPending ? 'Activating...' : 'Activate my account'}
        </button>
      </form>
    </AuthLayout>
  )
}
