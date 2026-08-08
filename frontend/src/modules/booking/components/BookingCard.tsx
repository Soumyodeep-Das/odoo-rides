import type { Booking } from '../types'
import { useCancelBooking } from '../hooks'
import { Clock, MapPin, Users, CreditCard } from 'lucide-react'
import { cn } from '#lib/utils'

interface BookingCardProps {
  booking: Booking
}

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function BookingCard({ booking }: BookingCardProps) {
  const { mutate: cancel, isPending } = useCancelBooking()
  const ride = booking.ride

  const totalPrice = booking.payment?.amount ?? (ride ? Number(ride.price) * booking.seats : 0)

  return (
    <article className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Status + Date */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider',
            booking.status === 'CONFIRMED' && 'bg-green-500/10 text-green-600',
            booking.status === 'CANCELLED' && 'bg-destructive/10 text-destructive'
          )}
        >
          {booking.status === 'CONFIRMED' ? 'Confirmed' : 'Cancelled'}
        </span>
        <span className="text-xs text-muted-foreground">
          Booked {formatDate(booking.createdAt)}
        </span>
      </div>

      {/* Route */}
      {ride ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{ride.pickup}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{ride.dropoff}</span>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {formatDate(ride.departure)} · {formatTime(ride.departure)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Ride details unavailable</p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Users className="w-3.5 h-3.5" />
          {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5 font-bold text-primary">
          <CreditCard className="w-3.5 h-3.5" />
          ₹{totalPrice}
        </span>
      </div>

      {/* Cancel action */}
      {booking.status !== 'CANCELLED' && (
        <button
          onClick={() =>
            cancel({ rideId: booking.rideId, bookingId: booking.id })
          }
          disabled={isPending}
          className="mt-auto w-full rounded-xl border border-destructive/40 px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Cancelling…' : 'Cancel Booking'}
        </button>
      )}
    </article>
  )
}
