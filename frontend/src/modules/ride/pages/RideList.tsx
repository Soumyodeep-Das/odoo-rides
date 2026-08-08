import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Users, MapPin } from 'lucide-react'
import { useRides } from '../hooks'
import { RideCard } from '../components/RideCard'
import { Loader } from '#components/shared/Loader'
import { cn } from '#lib/utils'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

export default function RideList() {
  const { data: rides, isLoading, error } = useRides()
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [searchParams, setSearchParams] = useState({
    pickup: '',
    destination: '',
    date: '',
    seats: 1
  })

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([22.5786, 88.4729])
      );
    } else {
      setPosition([22.5786, 88.4729]);
    }
  }, []);

  if (isLoading) return <div className="p-10 flex justify-center"><Loader /></div>
  if (error) return <div className="text-center text-destructive py-20 font-medium">Failed to load rides. Please try again.</div>

  // Client-side filtering to demonstrate search capabilities intuitively
  const filteredRides = rides?.filter(ride => {
    if (searchParams.pickup && !ride.origin.toLowerCase().includes(searchParams.pickup.toLowerCase())) return false;
    if (searchParams.destination && !ride.destination.toLowerCase().includes(searchParams.destination.toLowerCase())) return false;
    if (searchParams.seats > ride.availableSeats) return false;
    return true;
  }) || []

  return (
    <main className="lg:h-[calc(100vh-6rem)] h-[auto] min-h-[600px] flex flex-col lg:flex-row bg-card rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 m-4 lg:mx-auto lg:my-8 max-w-[1400px] border border-border/50">
      {/* Left Panel: Search & Results */}
      <div className="w-full lg:w-[480px] flex flex-col h-[50vh] lg:h-full bg-card z-10 shrink-0 border-b lg:border-b-0 lg:border-r border-border">
        {/* Search Form */}
        <div className="p-6 border-b border-border bg-card/80 backdrop-blur-xl relative z-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Find a ride<span className="text-primary inline-block">.</span></h1>
              <p className="text-sm font-medium text-muted-foreground mt-1">Book your daily commute easily.</p>
            </div>
            <Link
              to="/rides/create"
              className="rounded-xl border border-primary/20 bg-primary/10 text-primary px-4 py-2.5 text-xs font-bold hover:bg-primary/20 hover:border-primary/30 transition-all uppercase tracking-wider"
            >
              Offer Ride
            </Link>
          </div>

          <div className="space-y-4">
            {/* Pickup Input */}
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary/80 group-focus-within:bg-primary transition-colors" />
              <div className="absolute left-4 top-[32px] bottom-[-24px] w-0.5 bg-border z-0" />
              <input
                type="text"
                placeholder="Pickup location"
                className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all relative z-10"
                value={searchParams.pickup}
                onChange={e => setSearchParams(prev => ({ ...prev, pickup: e.target.value }))}
              />
            </div>
            {/* Destination Input */}
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-primary/80 group-focus-within:border-primary bg-card transition-colors z-10" />
              <input
                type="text"
                placeholder="Destination"
                className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all relative z-10"
                value={searchParams.destination}
                onChange={e => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
              />
            </div>

            <div className="flex gap-4 pt-2 relative z-10">
              {/* Date Picker (Mock) */}
              <div className="relative flex-1 group">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <input
                  type="date"
                  className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all text-foreground"
                  value={searchParams.date}
                  onChange={e => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              {/* Seat Selector */}
              <div className="relative w-32 group">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <select
                  className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all appearance-none cursor-pointer"
                  value={searchParams.seats}
                  onChange={e => setSearchParams(prev => ({ ...prev, seats: parseInt(e.target.value) }))}
                >
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Routes</h2>
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md uppercase tracking-wider">{filteredRides.length} found</span>
          </div>

          {filteredRides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center h-full">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5 animate-pulse">
                <Search className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <p className="font-extrabold text-foreground text-lg">No rides found</p>
              <p className="text-sm font-medium text-muted-foreground mt-1 max-w-[200px] leading-relaxed">Adjust your pickup time or search criteria</p>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {filteredRides.map((ride, idx) => (
                <div key={ride.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                  <RideCard ride={ride} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="flex-1 relative bg-[#f4f3ed] h-[50vh] lg:h-full">
        <div className="absolute inset-0 z-0 [&_.leaflet-control-attribution]:!text-[8px] [&_.leaflet-control-attribution]:!opacity-50">
          {position ? (
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} zoomControl={false} className="h-full w-full z-0 font-sans">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup className="font-sans font-medium text-sm rounded-xl">
                  Your Location
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full w-full bg-[#f4f3ed] flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-medium text-muted-foreground animate-pulse">Loading map data...</span>
            </div>
          )}
        </div>

        {/* Overlay gradient for premium aesthetics */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />
      </div>
    </main>
  )
}
