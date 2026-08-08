import { useRides } from '../hooks'
import { RideCard } from '../components/RideCard'
import { Loader } from '#components/shared/Loader'
import { Link } from 'react-router-dom'

export default function RideList() {
  const { data: rides, isLoading, error } = useRides()

  if (isLoading) return <Loader />
  if (error) return <p className="text-center text-destructive py-10">Failed to load rides.</p>

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Available Rides</h1>
        <Link
          to="/rides/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + Offer a Ride
        </Link>
      </div>

      {rides?.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">No rides available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rides?.map((ride) => <RideCard key={ride.id} ride={ride} />)}
        </div>
      )}
    </main>
  )
}
