import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Car, ArrowLeft, MapPin, Clock, Users, IndianRupee } from 'lucide-react'
import { useCreateRide } from '../hooks'
import { useAuth } from '#core/hooks/useAuth'
import client from '#core/api/client'
import { ENDPOINTS } from '#core/api/endpoints'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
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

const carIcon = L.divIcon({
  html: `<div style="background-color: #070707ff; padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
             <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
           </svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const bikeIcon = L.divIcon({
  html: `<div style="background-color: #060606ff; padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
             <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
           </svg>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

function MapUpdater({ originCoords, destCoords }: { originCoords: [number, number] | null, destCoords: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (originCoords && destCoords) {
      map.fitBounds([originCoords, destCoords], { padding: [50, 50] })
    } else if (originCoords) {
      map.setView(originCoords, 13)
    } else if (destCoords) {
      map.setView(destCoords, 13)
    }
  }, [originCoords, destCoords, map])
  return null
}

export default function CreateRide() {
  const { user } = useAuth()
  const { mutate: doCreate, isPending, error } = useCreateRide()
  const navigate = useNavigate()

  // User's registered vehicles
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehicleId, setVehicleId] = useState('')

  useEffect(() => {
    client.get<any>(ENDPOINTS.VEHICLES.MINE).then(({ data }) => {
      const list = data?.data || []
      setVehicles(list)
      if (list.length > 0) setVehicleId(list[0].id)
    }).catch(() => { })
  }, [])

  const [departure, setDeparture] = useState('')
  const [totalSeats, setTotalSeats] = useState(3)


  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null)
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null)
  const [routeMetrics, setRouteMetrics] = useState<{ distance: number, duration: number } | null>(null)
  const [position, setPosition] = useState<[number, number] | null>(null)

  const costPerKm = (user as any)?.orgSettings?.costPerKm ?? 4.5
  const calculatedPrice = routeMetrics ? Math.max(0, Math.round((routeMetrics.distance / 1000) * costPerKm)) : 0



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

  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = async () => {
    if (!position) return;
    setIsLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`);
      const data = await res.json();
      if (data && data.address) {
        const shortName = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || (data.display_name ? data.display_name.split(',')[0] : 'Current Location');
        setOrigin(shortName);
      }
    } catch (e) {
      console.error('Reverse geocoding error', e);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    const fetchCoords = async (query: string, setter: (c: [number, number] | null) => void) => {
      if (!query || query.length < 3) {
        setter(null)
        return
      }
      try {
        let viewboxParam = '';
        if (position) {
          const lat = position[0];
          const lon = position[1];
          // Create a roughly 220km bounding box around user's current location to prioritize local results
          viewboxParam = `&viewbox=${lon - 1},${lat + 1},${lon + 1},${lat - 1}`;
        }

        // We use viewbox rather than countrycodes to softly prioritize local locations without blocking foreign ones.
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}${viewboxParam}`)
        const data = await res.json()
        if (data && data.length > 0) {
          setter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
      } catch (e) {
        console.error('Geocoding error', e)
      }
    }

    const timer = setTimeout(() => {
      fetchCoords(origin, setOriginCoords)
      fetchCoords(destination, setDestCoords)
    }, 800)

    return () => clearTimeout(timer)
  }, [origin, destination])

  useEffect(() => {
    if (originCoords && destCoords) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`)
          const data = await res.json()
          if (data.code === 'Ok' && data.routes.length > 0) {
            const bestRoute = data.routes[0];
            const coordinates = bestRoute.geometry.coordinates;
            const latLngs = coordinates.map((c: [number, number]) => [c[1], c[0]]);
            setRouteCoords(latLngs as [number, number][]);
            setRouteMetrics({ distance: bestRoute.distance, duration: bestRoute.duration });
          }
        } catch (e) {
          console.error('Routing error', e)
        }
      }
      fetchRoute();
    } else {
      setRouteCoords(null);
      setRouteMetrics(null);
    }
  }, [originCoords, destCoords])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !vehicleId) return

    const distanceInKm = routeMetrics ? (routeMetrics.distance / 1000) : 0;
    doCreate(
      {
        vehicleId,
        pickup: origin,
        dropoff: destination,
        departure: departure ? new Date(departure).toISOString() : new Date(Date.now() + 3600000).toISOString(),
        totalSeats,
        distance: distanceInKm,
      },
      { onSuccess: () => navigate('/rides') }
    )
  }

  return (
    <main className="lg:h-[calc(100vh-6rem)] h-[auto] min-h-[700px] flex flex-col lg:flex-row bg-card rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 m-4 lg:mx-auto lg:my-8 max-w-[1400px] border border-border/50">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-[500px] flex flex-col h-full bg-card z-10 shrink-0 border-r border-border overflow-y-auto scrollbar-hide">
        <div className="p-6 lg:p-8">
          <Link to="/" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight">Offer a ride<span className="text-primary inline-block">.</span></h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 mb-8">Publish your route and share your journey.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Vehicle</label>
              <div className="relative group">
                <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                {vehicles.length === 0 ? (
                  <div className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-muted-foreground">
                    No vehicles registered —{' '}
                    <Link to="/vehicles/register" className="text-primary font-semibold hover:underline">register one first</Link>
                  </div>
                ) : (
                  <select
                    className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all appearance-none cursor-pointer"
                    required
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.carModel} · {v.regNo}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block border-b border-border pb-2">Route Details</label>

              {/* Origin */}
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary/80 group-focus-within:bg-primary transition-colors" />
                <div className="absolute left-4 top-[32px] bottom-[-24px] w-0.5 bg-border z-0" />
                <input
                  type="text"
                  name="origin"
                  required
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  placeholder="Pickup location (e.g. Salt Lake)"
                  className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-10 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all relative z-10 max-w-full text-ellipsis overflow-hidden whitespace-nowrap"
                />
                <button
                  onClick={handleCurrentLocation}
                  disabled={isLocating || !position}
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors z-20 disabled:opacity-50 bg-transparent border-none cursor-pointer"
                  title="Use current location"
                >
                  {isLocating ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Destination */}
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-primary/80 group-focus-within:border-primary bg-card transition-colors z-10" />
                <input
                  type="text"
                  name="destination"
                  required
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Destination (e.g. DLF IT Park)"
                  className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all relative z-10"
                />
              </div>
            </div>
            {/* Departure datetime + seats + price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Departure Date &amp; Time</label>
                <div className="relative group">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="datetime-local"
                    required
                    value={departure}
                    onChange={e => setDeparture(e.target.value)}
                    min={new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16)}
                    className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seats to Offer</label>
                <div className="relative group">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={totalSeats}
                    onChange={e => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price per Seat (₹)</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <div className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-foreground/80 cursor-not-allowed">
                    {routeMetrics ? calculatedPrice : '--'} <span className="text-muted-foreground ml-1 text-xs font-normal font-mono">(at ₹{costPerKm}/km)</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {(error as any)?.response?.data?.error || (error as Error).message}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending || !routeMetrics}
                className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60 transition-all uppercase tracking-wider"
              >
                {isPending ? 'Publishing Ride…' : 'Publish Ride'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel: Map */}
      <div className="flex-1 relative bg-[#f4f3ed] h-[300px] lg:h-full">
        <div className="absolute inset-0 z-0 [&_.leaflet-control-attribution]:!text-[8px] [&_.leaflet-control-attribution]:!opacity-50">
          {position ? (
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} zoomControl={false} className="h-full w-full z-0 font-sans">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater originCoords={originCoords} destCoords={destCoords} />

              {originCoords ? (
                <Marker position={originCoords} icon={vehicleId === 'tvs_jupiter' ? bikeIcon : carIcon}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Pickup Location</Popup>
                </Marker>
              ) : (
                <Marker position={position} icon={vehicleId === 'tvs_jupiter' ? bikeIcon : carIcon}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Current Location</Popup>
                </Marker>
              )}

              {destCoords && (
                <Marker position={destCoords}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Destination</Popup>
                </Marker>
              )}

              {routeCoords && (
                <Polyline positions={routeCoords} pathOptions={{ color: '#080a09ff', weight: 4, opacity: 0.8 }} />
              )}
            </MapContainer>
          ) : (
            <div className="h-full w-full bg-[#f4f3ed] flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-medium text-muted-foreground animate-pulse">Initializing map...</span>
            </div>
          )}
        </div>

        {/* Overlay gradient */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-card to-transparent pointer-events-none z-10" />

        {/* Map Floating Info block */}
        <div className="absolute top-6 right-6 bg-card/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl z-20 max-w-xs pointer-events-none hidden md:block">
          <h3 className="text-sm font-bold">Optimal Route Preview</h3>
          {routeMetrics ? (
            <div className="mt-2 flex flex-col gap-1">
              <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-md inline-block w-max">
                {Math.round(routeMetrics.duration / 60)} mins
              </span>
              <span className="text-xs font-bold text-foreground px-2 py-1 bg-muted rounded-md inline-block w-max">
                {(routeMetrics.distance / 1000).toFixed(1)} km
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">Configure your route details on the left. Publishing allows others traveling in the same direction to share your journey.</p>
          )}
        </div>
      </div>
    </main>
  )
}
