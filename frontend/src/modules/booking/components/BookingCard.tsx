import type { Booking } from '../types'
import { formatDate, formatTime } from '#core/utils/helpers'
import { useCancelBooking } from '../hooks'

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { mutate: cancel, isPending } = useCancelBooking()
  const { ride } = booking

  return (
    <article className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize
          ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-600' : ''}
          ${booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600' : ''}
          ${booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : ''}
        `}>
          {booking.status}
        </span>
        <span className="text-xs text-muted-foreground">
          Booked {formatDate(booking.createdAt)}
        </span>
      </div>

      <div>
        <p className="font-semibold text-lg leading-tight">
          {ride.origin} → {ride.destination}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {formatDate(ride.departureTime)} · {formatTime(ride.departureTime)}
        </p>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>{booking.seatsBooked} seat{booking.seatsBooked !== 1 ? 's' : ''}</span>
        <span className="font-semibold text-primary">₹{booking.totalPrice}</span>
      </div>

      {booking.status !== 'cancelled' && (
        <button
          onClick={() => cancel(booking.id)}
          disabled={isPending}
          className="mt-auto w-full rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Cancelling…' : 'Cancel Booking'}
        </button>
      )}
    </article>
  )
}
