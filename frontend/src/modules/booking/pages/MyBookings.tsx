import { useMyBookings } from '../hooks'
import { BookingCard } from '../components/BookingCard'
import { Loader } from '#components/shared/Loader'

export default function MyBookings() {
  const { data: bookings, isLoading, error } = useMyBookings()

  if (isLoading) return <Loader />
  if (error) return <p className="text-center text-destructive py-10">Failed to load bookings.</p>

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings?.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings?.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
        </div>
      )}
    </main>
  )
}
