import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Calendar, Users, MapPin, ArrowLeft } from 'lucide-react'
import { useRides } from '../hooks'
import { RideCard } from '../components/RideCard'
import { Loader } from '#components/shared/Loader'
import { cn } from '#lib/utils'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'

function MapBoundsUpdater({ coords1, coords2, coords3, coords4 }: { coords1: any, coords2: any, coords3: any, coords4: any }) {
  const map = useMap()
  useEffect(() => {
    const validBounds = [coords1, coords2, coords3, coords4].filter(Boolean) as [number, number][];
    if (validBounds.length > 1) {
      map.fitBounds(validBounds, { padding: [50, 50] })
    } else if (validBounds.length === 1) {
      map.setView(validBounds[0], 13)
    }
  }, [coords1, coords2, coords3, coords4, map])
  return null
}
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

const walkIcon = L.divIcon({
  html: `<div style="background-color: #0ea5e9; padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">
           <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
         </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export default function RideList() {
  const [urlParams] = useSearchParams()
  const [searchParams, setSearchParams] = useState({
    pickup: urlParams.get('pickup') || '',
    destination: urlParams.get('destination') || '',
    date: urlParams.get('date') || '',
    seats: parseInt(urlParams.get('seats') || '1')
  })

  const [debouncedParams, setDebouncedParams] = useState(searchParams)

  const [position, setPosition] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)

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

  const handleCurrentLocation = async () => {
    if (!position) return;
    setIsLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`);
      const data = await res.json();
      if (data && data.address) {
        const shortName = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || (data.display_name ? data.display_name.split(',')[0] : 'Current Location');
        setSearchParams(prev => ({ ...prev, pickup: shortName }));
      }
    } catch (e) {
      console.error('Reverse geocoding error', e);
    } finally {
      setIsLocating(false);
    }
  };

  const [selectedRide, setSelectedRide] = useState<any | null>(null)
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null)
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null)

  const [userOriginCoords, setUserOriginCoords] = useState<[number, number] | null>(null)
  const [userDestCoords, setUserDestCoords] = useState<[number, number] | null>(null)
  const [dynamicPickupCoords, setDynamicPickupCoords] = useState<[number, number] | null>(null)
  const [dynamicDropCoords, setDynamicDropCoords] = useState<[number, number] | null>(null)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedParams(searchParams), 400)
    return () => clearTimeout(handler)
  }, [searchParams])

  useEffect(() => {
    const fetchUserCoords = async (query: string, setter: (c: [number, number] | null) => void) => {
      if (!query || query.length < 3) return setter(null);
      try {
        let viewboxParam = '';
        if (position) {
          viewboxParam = `&viewbox=${position[1] - 1},${position[0] + 1},${position[1] + 1},${position[0] - 1}`;
        }
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}${viewboxParam}`)
        const data = await res.json()
        if (data && data.length > 0) setter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
      } catch (e) {
        console.error('Geocoding error', e)
      }
    }
    const timer = setTimeout(() => {
      fetchUserCoords(debouncedParams.pickup, setUserOriginCoords)
      fetchUserCoords(debouncedParams.destination, setUserDestCoords)
    }, 800)
    return () => clearTimeout(timer)
  }, [debouncedParams.pickup, debouncedParams.destination, position])

  const { data: rides, isLoading, error } = useRides({
    ...(debouncedParams.pickup && { pickup: debouncedParams.pickup }),
    ...(debouncedParams.destination && { dropoff: debouncedParams.destination }),
    ...(debouncedParams.date && { date: debouncedParams.date }),
    minSeats: debouncedParams.seats
  })

  useEffect(() => {
    if (!selectedRide) {
      setOriginCoords(null)
      setDestCoords(null)
      return
    }
    const fetchCoords = async (query: string, setter: (c: [number, number] | null) => void) => {
      try {
        let viewboxParam = '';
        if (position) {
          const lat = position[0];
          const lon = position[1];
          // Create a roughly 220km bounding box around user's current location to prioritize local results
          viewboxParam = `&viewbox=${lon - 1},${lat + 1},${lon + 1},${lat - 1}`;
        }
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}${viewboxParam}`)
        const data = await res.json()
        if (data && data.length > 0) {
          setter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
      } catch (e) {
        console.error('Geocoding error', e)
      }
    }
    fetchCoords(selectedRide.pickup, setOriginCoords)
    fetchCoords(selectedRide.dropoff, setDestCoords)
  }, [selectedRide, position])

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
          }
        } catch (e) {
          console.error('Routing error', e)
        }
      }
      fetchRoute();
    } else {
      setRouteCoords(null);
    }
  }, [originCoords, destCoords])

  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const getNearest = (point: [number, number], route: [number, number][]) => {
        let minDiff = Infinity;
        let nearest = route[0];
        for (const pt of route) {
          const dLat = pt[0] - point[0];
          const dLng = pt[1] - point[1];
          const distSq = dLat * dLat + dLng * dLng;
          if (distSq < minDiff) {
            minDiff = distSq;
            nearest = pt;
          }
        }
        return nearest;
      }

      if (userOriginCoords) setDynamicPickupCoords(getNearest(userOriginCoords, routeCoords))
      else setDynamicPickupCoords(null)

      if (userDestCoords) setDynamicDropCoords(getNearest(userDestCoords, routeCoords))
      else setDynamicDropCoords(null)
    } else {
      setDynamicPickupCoords(null)
      setDynamicDropCoords(null)
    }
  }, [routeCoords, userOriginCoords, userDestCoords])

  // Display rides strictly from the backend search API
  const filteredRides = Array.isArray(rides) ? rides : ((rides as any)?.data || [])

  return (
    <main className="lg:h-[calc(100vh-6rem)] h-[auto] min-h-[600px] flex flex-col lg:flex-row bg-card rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 m-4 lg:mx-auto lg:my-8 max-w-[1400px] border border-border/50">
      {/* Left Panel: Search & Results */}
      <div className="w-full lg:w-[480px] flex flex-col h-[50vh] lg:h-full bg-card z-10 shrink-0 border-b lg:border-b-0 lg:border-r border-border">
        {/* Search Form */}
        <div className="p-6 border-b border-border bg-card/80 backdrop-blur-xl relative z-20">
          <Link to="/" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
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
                className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-10 py-3 text-sm font-semibold focus:outline-none focus:border-primary/50 focus:bg-background transition-all relative z-10 max-w-full text-ellipsis overflow-hidden"
                value={searchParams.pickup}
                onChange={e => setSearchParams(prev => ({ ...prev, pickup: e.target.value }))}
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
                  {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>)}
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 h-full">
              <Loader />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 h-full text-destructive font-medium text-center">
              Failed to load rides. Please try again.
            </div>
          ) : filteredRides.length === 0 ? (
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
                <div
                  key={ride.id}
                  className={cn(
                    "animate-in fade-in slide-in-from-bottom-4 cursor-pointer transition-all rounded-2xl",
                    selectedRide?.id === ride.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/30"
                  )}
                  onClick={() => setSelectedRide(ride)}
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                >
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
              <MapBoundsUpdater coords1={originCoords} coords2={destCoords} coords3={userOriginCoords} coords4={userDestCoords} />

              {/* Dotted lines for walking */}
              {userOriginCoords && dynamicPickupCoords && (
                <Polyline positions={[userOriginCoords, dynamicPickupCoords]} pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.7, dashArray: "5, 10" }} />
              )}
              {userDestCoords && dynamicDropCoords && (
                <Polyline positions={[dynamicDropCoords, userDestCoords]} pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.7, dashArray: "5, 10" }} />
              )}

              {/* Computed Dynamic Stops */}
              {dynamicPickupCoords && (
                <Marker position={dynamicPickupCoords} icon={selectedRide?.vehicle?.seats <= 2 ? bikeIcon : carIcon}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Dynamic Pickup Stop</Popup>
                </Marker>
              )}
              {dynamicDropCoords && (
                <Marker position={dynamicDropCoords}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Dynamic Drop-off Stop</Popup>
                </Marker>
              )}

              {/* User Original Input Markers */}
              {userOriginCoords && (
                <Marker position={userOriginCoords} icon={walkIcon}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Your starting point</Popup>
                </Marker>
              )}
              {userDestCoords && (
                <Marker position={userDestCoords} icon={walkIcon}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Your destination point</Popup>
                </Marker>
              )}

              {/* Map driver's exact journey behind everything */}
              {routeCoords && (
                <Polyline positions={routeCoords} pathOptions={{ color: '#080a09ff', weight: 4, opacity: 0.5 }} />
              )}

              {/* Fallback to user location if absolutely nothing is mapped */}
              {!userOriginCoords && !originCoords && (
                <Marker position={position} icon={carIcon}>
                  <Popup className="font-sans font-medium text-sm rounded-xl">Your Location</Popup>
                </Marker>
              )}
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
