export interface ReportSummary {
  totalRides: number
  totalEmployees: number
  totalVehicles: number
  totalBookings: number
  co2Saved: number        // kg
  fuelSaved: number       // litres
  costSaved: number       // INR
}

export interface RidesByDayItem {
  date: string
  rides: number
  bookings: number
}

export interface DepartmentRideItem {
  department: string
  rides: number
}
