import React, { useState, useEffect } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { Search, PlusCircle, LogOut, Shield } from 'lucide-react'


import { cn } from '#lib/utils'
import { useAuth } from '#core/hooks/useAuth'
import { useMyVehicles } from '../../vehicle/hooks'
import { useMyBookings } from '../../booking/hooks'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix missing marker icons natively in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})
export default function EmployeeDashboardPage() {

    const { user, clearAuth } = useAuth()
    const navigate = useNavigate()
    const { data: myVehicles } = useMyVehicles()
    const { data: myBookings } = useMyBookings()
    const activeBooking = myBookings?.[0]

    const [position, setPosition] = useState<[number, number] | null>(null)

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
                () => setPosition([22.5786, 88.4729]) // Salt Lake default
            );
        } else {
            setPosition([22.5786, 88.4729]);
        }
    }, []);
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting = "Good Evening";
    if (currentHour < 12) {
        greeting = "Good Morning";
    } else if (currentHour < 18) {
        greeting = "Good Afternoon";
    }

    return (
        <main className="container mx-auto px-4 py-8 space-y-12 max-w-5xl">

            {/* ---------- Hero ---------- */}
            <section>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <h1 className="text-4xl font-extrabold tracking-tight">Odoo Rıdes<span className="text-primary animate-drive-swoosh inline-block">.</span></h1>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className="hidden sm:flex items-center gap-2 rounded-lg border border-primary text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/10 transition-colors">
                                    <Shield className="h-4 w-4" />
                                    Admin Mode
                                </Link>
                            )}
                        </div>
                        <div className="relative h-14 min-w-[280px]">
                            <div className="absolute inset-0 animate-crossfade-1">
                                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Welcome back</div>

                                <h2 className="text-2xl font-bold mt-1 whitespace-nowrap">{greeting}, <span className="text-primary">{user?.name?.split(' ')[0] || 'User'}</span></h2>

                            </div>
                            <div className="absolute inset-0 opacity-0 animate-crossfade-2">
                                <div className="text-sm font-semibold text-primary uppercase tracking-wide">Your next ride</div>
                                <h2 className="text-2xl font-bold mt-1">Where are you headed?</h2>
                            </div>
                        </div>
                    </div>

                    {activeBooking ? (
                        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col gap-3 min-w-[320px]">
                            <div>
                                <div className="text-sm font-medium font-mono text-foreground">{activeBooking.ride?.pickup || 'Pickup'} <span className="opacity-50 mx-1">→</span> {activeBooking.ride?.dropoff || 'Dropoff'}</div>
                                <span className={cn(
                                    "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize mt-2 inline-block",
                                    activeBooking.status === 'CONFIRMED' ? "bg-emerald-500/10 text-emerald-600" :
                                        activeBooking.status === 'CANCELLED' ? "bg-destructive/10 text-destructive" :
                                            "bg-amber-500/10 text-amber-600"
                                )}>
                                    {activeBooking.status.toLowerCase()}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-right text-primary">
                                {activeBooking.ride?.departure ? (
                                    activeBooking.ride.departure.includes('T')
                                        ? new Date(activeBooking.ride.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : activeBooking.ride.departure
                                ) : '08:14'}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-center items-center gap-3 min-w-[320px] opacity-70">
                            <div className="text-sm font-medium text-muted-foreground">No active rides</div>
                            <Link to="/rides" className="text-xs font-bold text-primary hover:underline">Find a ride →</Link>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Link to="/rides" className="rounded-2xl border border-border bg-primary text-primary-foreground p-6 hover:bg-primary/95 transition-colors group">
                        <div className="mb-3"><Search className="h-6 w-6 text-primary-foreground/90 group-hover:text-primary-foreground transition-colors" /></div>
                        <div className="font-semibold text-lg">Find a ride</div>
                        <div className="text-sm text-primary-foreground/70 mt-1">Search rides matching your route and time</div>
                    </Link>

                    <Link to="/rides/create" className="rounded-2xl border border-border bg-card p-6 text-foreground hover:bg-muted transition-colors group">
                        <div className="mb-3"><PlusCircle className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" /></div>
                        <div className="font-semibold text-lg">Offer a ride</div>
                        <div className="text-sm text-muted-foreground mt-1">Publish your route, set fare and seats</div>
                    </Link>
                </div>
            </section>

            {/* ---------- Last 3 rides ---------- */}
            <section>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Last 3 rides</h3>
                    <span className="text-xs font-medium text-primary cursor-pointer hover:underline">View all →</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* TODO: Replace this dummy data with real data fetched from the database backend later */}
                    {[
                        { date: '7 Aug, 2026', seats: 2, fare: 85, dep: '08:14', color: 'emerald', pickup: 'Park Street' },
                        { date: '6 Aug, 2026', seats: 1, fare: 70, dep: '08:25', color: 'emerald', pickup: 'Salt Lake Sector V' },
                        { date: '5 Aug, 2026', seats: 3, fare: 60, dep: '08:30', color: 'emerald', pickup: 'New Town' }
                    ].map((ride, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                const pickup = ride.pickup;
                                const drop = `DLF IT Park gate ${i % 2 === 0 ? 2 : 1}`;
                                const navDate = new Date().toISOString().split('T')[0];
                                navigate(`/rides?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(drop)}&date=${navDate}`);
                            }}
                            className="rounded-2xl border border-dashed border-border bg-card p-5 hover:border-solid hover:border-primary/30 transition-all cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="font-semibold text-sm">{ride.date}</div>
                                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize bg-emerald-500/10 text-emerald-600">
                                    {ride.seats} left
                                </span>
                            </div>
                            <div className="space-y-1 py-1">
                                <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" /> {ride.pickup}
                                </div>
                                <div className="w-0.5 h-3 bg-border ml-0.5" />
                                <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" /> DLF IT Park gate {i % 2 === 0 ? 2 : 1}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-5 pt-4 border-t border-border">
                                <div className="font-bold text-base">₹{ride.fare}</div>
                                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">DEP {ride.dep}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- Active trip ---------- */}
            <section>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">My trips — active</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7 h-[280px] rounded-2xl border border-border bg-muted relative overflow-hidden flex items-end p-4">
                        <div className="absolute inset-0 z-0 [&_.leaflet-control-attribution]:!text-[8px] [&_.leaflet-control-attribution]:!opacity-50">
                            {position ? (
                                <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full z-0 font-sans">
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={position}>
                                        <Popup className="font-sans font-medium text-sm">
                                            Your Location
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="h-full w-full bg-[#f4f3ed] animate-pulse" />
                            )}
                        </div>
                        <div className="rounded-lg bg-primary text-primary-foreground text-xs font-mono px-3 py-1.5 z-10 font-medium shadow-md">
                            ETA 6 min · 2.1 km remaining
                        </div>
                    </div>

                    <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                        <div className="mb-6 relative flex justify-between px-2 pt-2">
                            <div className="absolute top-4 left-6 right-6 h-0.5 bg-border z-0"></div>

                            <div className="flex flex-col items-center gap-2.5 z-10 flex-1">
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-card" />
                                <span className="text-[10px] uppercase font-bold text-foreground">Booked</span>
                            </div>
                            <div className="flex flex-col items-center gap-2.5 z-10 flex-1">
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-card" />
                                <span className="text-[10px] uppercase font-bold text-foreground">Started</span>
                            </div>
                            <div className="flex flex-col items-center gap-2.5 z-10 flex-1">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-card" />
                                <span className="text-[10px] uppercase font-bold text-foreground">Transit</span>
                            </div>
                            <div className="flex flex-col items-center gap-2.5 z-10 flex-1">
                                <div className="w-3.5 h-3.5 rounded-full bg-muted border-2 border-border" />
                                <span className="text-[10px] uppercase font-medium text-muted-foreground mt-0.5">Done</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-5 border-t border-border mt-auto">
                            <div className="w-10 h-10 rounded-full bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs uppercase">
                                AS
                            </div>
                            <div>
                                <div className="font-semibold text-sm">Ananya Sen</div>
                                <div className="text-xs text-muted-foreground mt-0.5">Honda City · WB 24 CX 4471</div>
                            </div>
                            <button className="ml-auto rounded-lg px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors uppercase tracking-wide">
                                Call
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Vehicles ---------- */}
            <section>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">My vehicles</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {myVehicles?.map((vehicle: any) => (
                        <div key={vehicle.id} className="rounded-2xl border border-border bg-card p-5">
                            <div className="font-semibold text-sm">{vehicle.make} {vehicle.carModel}</div>
                            <div className="text-xs font-mono text-muted-foreground mt-1">{vehicle.regNo}</div>
                            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                                {vehicle.seats} seat{vehicle.seats > 1 ? 's' : ''} ·
                                <span className={cn(
                                    "ml-1 font-semibold",
                                    vehicle.status === 'APPROVED' ? "text-emerald-600" :
                                        vehicle.status === 'REJECTED' ? "text-destructive" :
                                            "text-amber-600"
                                )}>
                                    {vehicle.status === 'APPROVED' ? 'Registered' : vehicle.status === 'REJECTED' ? 'Rejected' : 'Pending Approval'}
                                </span>
                            </div>
                        </div>
                    ))}
                    <Link to="/vehicles/register" className="rounded-2xl border border-dashed border-border flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted transition-colors hover:text-foreground min-h-[120px]">
                        + Register vehicle
                    </Link>
                </div>
            </section>

            {/* ---------- Wallet ---------- */}
            <section>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Wallet</h3>
                </div>
                <div className="rounded-2xl bg-primary text-primary-foreground p-6 flex justify-between items-center">
                    <div>
                        <div className="text-xs font-semibold opacity-70 uppercase tracking-widest">Available Balance</div>
                        <div className="text-3xl font-bold mt-2 font-mono">₹430</div>
                    </div>
                    <Link to="/recharge" className="bg-background text-foreground rounded-xl px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center">
                        + Recharge
                    </Link>
                </div>

                <div className="rounded-2xl border border-border bg-card mt-4 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-border">
                        <div>
                            <div className="font-medium text-sm">Ride — Ananya Sen</div>
                            <div className="text-xs text-muted-foreground mt-1 font-mono">Today, 08:14</div>
                        </div>
                        <div className="font-bold text-destructive text-sm">− ₹85</div>
                    </div>
                    <div className="flex justify-between items-center p-4 border-b border-border">
                        <div>
                            <div className="font-medium text-sm">Wallet recharge</div>
                            <div className="text-xs text-muted-foreground mt-1 font-mono">Yesterday, 19:02</div>
                        </div>
                        <div className="font-bold text-emerald-600 text-sm">+ ₹500</div>
                    </div>
                </div>
            </section>

            {/* ---------- Reports ---------- */}
            <section>
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Reports</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Total trips', val: '42', sub: 'This month' },
                        { label: 'Distance', val: '318 km', sub: 'This month' },
                        { label: 'Cost per km', val: '₹4.20', sub: 'Average' },
                        { label: 'Fuel saved', val: '21 L', sub: 'Estimated' },
                    ].map((r, i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card p-5">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{r.label}</div>
                            <div className="text-2xl font-bold mt-2">{r.val}</div>
                            <div className="text-xs text-muted-foreground mt-1 font-medium">{r.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- Logout ---------- */}
            <section className="pt-4 border-t border-border mt-8 flex justify-center">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-colors font-semibold text-sm uppercase tracking-wider"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </section>

        </main>
    )
}
