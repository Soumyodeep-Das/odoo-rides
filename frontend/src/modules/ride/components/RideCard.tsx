import type { Ride } from '../types'
import { formatDate, formatTime } from '#core/utils/helpers'
import { useCreateBooking } from '#modules/booking/hooks'

interface RideCardProps {
  ride: Ride
}

export function RideCard({ ride }: RideCardProps) {
  const { mutate: book, isPending } = useCreateBooking()

  return (
    <article className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
          {ride.status}
        </span>
        <span className="text-xs text-muted-foreground">by {ride.driver.name}</span>
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
        <span>{ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left</span>
        <span className="font-semibold text-primary">₹{ride.pricePerSeat}/seat</span>
      </div>

      <button
        onClick={() => book({ rideId: ride.id, seatsBooked: 1 })}
        disabled={isPending || ride.status !== 'active'}
        className="mt-auto w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Booking…' : 'Book Seat'}
      </button>
    </article>
  )
}
