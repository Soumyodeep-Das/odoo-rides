import { useNavigate } from 'react-router-dom'
import { useCreateRide } from '../hooks'

export default function CreateRide() {
  const { mutate: doCreate, isPending, error } = useCreateRide()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    doCreate(
      {
        origin: form.get('origin') as string,
        destination: form.get('destination') as string,
        departureTime: form.get('departureTime') as string,
        availableSeats: Number(form.get('availableSeats')),
        pricePerSeat: Number(form.get('pricePerSeat')),
      },
      { onSuccess: () => navigate('/') }
    )
  }

  return (
    <main className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Offer a Ride</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'origin', label: 'From', type: 'text', placeholder: 'e.g. Mumbai' },
          { name: 'destination', label: 'To', type: 'text', placeholder: 'e.g. Pune' },
          { name: 'departureTime', label: 'Departure Time', type: 'datetime-local', placeholder: '' },
          { name: 'availableSeats', label: 'Available Seats', type: 'number', placeholder: '4' },
          { name: 'pricePerSeat', label: 'Price per Seat (₹)', type: 'number', placeholder: '200' },
        ].map(({ name, label, type, placeholder }) => (
          <div key={name} className="space-y-1">
            <label htmlFor={name} className="text-sm font-medium">{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              required
              min={type === 'number' ? 1 : undefined}
              placeholder={placeholder}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        ))}

        {error && (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? 'Creating…' : 'Create Ride'}
        </button>
      </form>
    </main>
  )
}
