import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useOnboard } from '../hooks'

type Step = 1 | 2

export default function Register() {
  const [step, setStep] = useState<Step>(1)
  const [fields, setFields] = useState({
    orgName: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
  })

  const { mutate: doOnboard, isPending, error } = useOnboard()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStep(2)
  }

  const handleStep2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    doOnboard(fields)
  }

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-all duration-300'

  return (
    <AuthLayout
      title={step === 1 ? 'Create your account' : 'Set up your organisation'}
      subtitle={
        step === 1
          ? 'Enter your details to get started as an admin'
          : 'Almost there — tell us about your organisation'
      }
    >
      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              s <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="adminName" className="text-sm font-medium">Full Name</label>
            <input id="adminName" name="adminName" type="text" required
              placeholder="Jane Doe" className={inputClass}
              value={fields.adminName} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label htmlFor="adminEmail" className="text-sm font-medium">Email address</label>
            <input id="adminEmail" name="adminEmail" type="email" required
              placeholder="you@company.com" className={inputClass}
              value={fields.adminEmail} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label htmlFor="adminPhone" className="text-sm font-medium">Phone number</label>
            <input id="adminPhone" name="adminPhone" type="tel" required
              placeholder="+91 98765 43210" className={inputClass}
              value={fields.adminPhone} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label htmlFor="adminPassword" className="text-sm font-medium">Password</label>
            <input id="adminPassword" name="adminPassword" type="password" required minLength={8}
              placeholder="Min. 8 characters" className={inputClass}
              value={fields.adminPassword} onChange={handleChange} />
          </div>

          <button type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 w-full hover:scale-[1.01] active:scale-[0.99] duration-300 mt-2">
            Continue →
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="orgName" className="text-sm font-medium">Organisation name</label>
            <input id="orgName" name="orgName" type="text" required minLength={2}
              placeholder="Acme Corp" className={inputClass}
              value={fields.orgName} onChange={handleChange} />
          </div>

          {error && (
            <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              {(error as Error).message}
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium hover:bg-accent hover:scale-[1.01] active:scale-[0.99] duration-300 flex-1">
              ← Back
            </button>
            <button type="submit" disabled={isPending}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] duration-300 flex-1">
              {isPending ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-indigo-500 hover:underline transition-colors">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
