export interface ReportSummary {
  totalRides:     number
  totalEmployees: number
  totalVehicles:  number
  totalBookings:  number
  co2Saved:       number   // kg
  fuelSaved:      number   // litres
  costSaved:      number   // INR
}

export interface RidesByDayItem {
  date:     string
  rides:    number
  bookings: number
}

// Ride status breakdown — for donut chart
export type RideStatusValue = 'active' | 'full' | 'completed' | 'cancelled'
export interface RideStatusItem {
  status: RideStatusValue
  count:  number
}

// Seat utilisation per day — for stacked bar chart
export interface SeatUtilizationItem {
  date:           string
  availableSeats: number
  bookedSeats:    number
}
