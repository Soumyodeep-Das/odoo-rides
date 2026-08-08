import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useEmployeeOnboard } from '../hooks'

export default function EmployeeOnboarding() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { mutate: doOnboard, isPending, error, isSuccess } = useEmployeeOnboard()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-all duration-300'

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This invite link is missing or malformed.">
        <p className="text-sm text-muted-foreground text-center">
          Please contact your administrator to resend the invitation.
        </p>
      </AuthLayout>
    )
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm = form.get('confirm') as string
    const phone = form.get('phone') as string

    if (password !== confirm) {
      alert('Passwords do not match')
      return
    }
    doOnboard({ token, password, phone, avatar: avatarFile })
  }

  return (
    <AuthLayout
      title="Welcome to OdooRides 👋"
      subtitle="Set up your account to start commuting with your team"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group h-20 w-20 rounded-full overflow-hidden border-2 border-dashed border-input hover:border-primary transition-colors duration-200 flex items-center justify-center bg-muted"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl text-muted-foreground group-hover:text-primary transition-colors">+</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </button>
          <span className="text-xs text-muted-foreground">
            {avatarFile ? avatarFile.name : 'Upload profile photo (optional)'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Create password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Min. 8 characters"
            className={inputClass}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirm" className="text-sm font-medium">Confirm password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={8}
            placeholder="Repeat your password"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
            {(error as Error).message}
          </div>
        )}

        {isSuccess && (
          <div className="p-3 text-sm rounded-md bg-green-500/15 text-green-700 border border-green-500/20">
            Account activated! Taking you to your dashboard…
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isSuccess}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 w-full hover:scale-[1.01] active:scale-[0.99] duration-300"
        >
          {isPending ? 'Activating…' : 'Activate my account'}
        </button>
      </form>
    </AuthLayout>
  )
}
