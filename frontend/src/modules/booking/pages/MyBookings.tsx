import { Link } from 'react-router-dom'
import { ArrowLeft, Ticket } from 'lucide-react'
import { useMyBookings } from '../hooks'
import { BookingCard } from '../components/BookingCard'
import { Loader } from '#components/shared/Loader'

export default function MyBookings() {
  const { data: bookings, isLoading, error } = useMyBookings()

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Ticket className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground font-medium">Your upcoming and past rides</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-center text-destructive py-20 font-medium">Failed to load bookings.</p>
      ) : !bookings?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
            <Ticket className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <p className="font-extrabold text-foreground text-lg">No bookings yet</p>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Find a ride and book your first seat
          </p>
          <Link
            to="/rides"
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Find a Ride
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </main>
  )
}
