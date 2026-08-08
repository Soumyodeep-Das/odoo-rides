import { Search, PlusCircle, Car } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardQuickActions() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/rides" className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center group hover:bg-muted transition-colors">
                <div className="rounded-lg bg-emerald-500/10 p-3 flex items-center justify-center">
                    <Search className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="font-semibold text-sm">Find a Ride</span>
            </Link>

            <Link to="/rides/create" className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center group hover:bg-muted transition-colors">
                <div className="rounded-lg bg-blue-500/10 p-3 flex items-center justify-center">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-sm">Offer a Ride</span>
            </Link>

            <Link to="/bookings" className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center group hover:bg-muted transition-colors">
                <div className="rounded-lg bg-violet-500/10 p-3 flex items-center justify-center">
                    <Car className="h-6 w-6 text-violet-600" />
                </div>
                <span className="font-semibold text-sm">My Trips</span>
            </Link>
        </div>
    )
}
