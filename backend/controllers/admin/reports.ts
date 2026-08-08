import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export const getReportSummary = async (req: Request, res: Response) => {
  try {
    const totalRides = await prisma.ride.count({
      where: { status: { not: 'CANCELED' } }
    })
    
    const totalEmployees = await prisma.user.count()
    
    const totalVehicles = await prisma.vehicle.count()

    const totalBookings = await prisma.booking.count()
    
    // For eco calculations, if actual distance isn't there, we assume an average distance of 15km per ride
    const bookings = await prisma.booking.findMany({
      include: { ride: true }
    })
    
    const allowance = 3.0
    const fuelCost = 90.0
    
    let co2Saved = 0
    let costSaved = 0
    
    for (const b of bookings) {
      const seats = b.seats || 1
      const distance = 15.0
      
      co2Saved += seats * distance * 0.21
      costSaved += seats * distance * allowance
    }
    
    const fuelSaved = fuelCost > 0 ? costSaved / fuelCost : 0

    res.json({
      totalRides,
      totalEmployees,
      totalVehicles,
      totalBookings,
      co2Saved: Number(co2Saved.toFixed(2)),
      fuelSaved: Number(fuelSaved.toFixed(2)),
      costSaved: Number(costSaved.toFixed(2)),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report summary' })
  }
}

export const getRidesByDay = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 14
    
    // Get past X days
    const result: any[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const ridesCount = await prisma.ride.count({
        where: {
          departure: {
            gte: date,
            lt: nextDate
          }
        }
      })
      
      const dayBookings = await prisma.booking.findMany({
        where: {
          ride: {
            departure: {
              gte: date,
              lt: nextDate
            }
          }
        }
      })
      
      const seatsCount = dayBookings.reduce((sum: number, b: any) => sum + (b.seats || 1), 0)
      
      result.push({
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        rides: ridesCount,
        bookings: seatsCount,
      })
    }
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rides by day' })
  }
}

export const getRideStatusBreakdown = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.ride.groupBy({
      by: ['status'],
      _count: {
        _all: true
      }
    })
    
    const mapped = groups.map((g: any) => ({
      status: g.status.toLowerCase(),
      count: g._count._all
    }))
    
    // Ensure all standard statuses are present even if 0
    const standardStatuses = ['scheduled', 'active', 'canceled', 'completed']
    const result = standardStatuses.map(s => {
      const found = mapped.find((m: any) => m.status === s)
      // Front-end expects 'cancelled' and 'full' in some places, adapting to their specific enum
      let statusName = s
      if (s === 'canceled') statusName = 'cancelled'
      if (s === 'scheduled') statusName = 'active' // Front-end merges these conceptually
      return {
        status: statusName,
        count: found ? found.count : 0
      }
    })
    
    // We group 'scheduled' and 'active' as active in the frontend
    const activeCount = result.find(r => r.status === 'active')?.count || 0
    const activeIndex = result.findIndex(r => r.status === 'active')
    if (activeIndex !== -1 && result[activeIndex]) {
      result[activeIndex]!.count = activeCount // already merged if we matched by logic above
    }
    
    // Remove duplicate actives and return 
    const finalResult = [
      { status: 'active', count: (mapped.find((m: any) => m.status === 'scheduled')?.count || 0) + (mapped.find((m: any) => m.status === 'active')?.count || 0) },
      { status: 'completed', count: mapped.find((m: any) => m.status === 'completed')?.count || 0 },
      { status: 'cancelled', count: mapped.find((m: any) => m.status === 'canceled')?.count || 0 },
      { status: 'full', count: 0 }, // We don't have a 'FULL' state in DB, we'd need to calculate it based on totalSeats
    ]
    
    res.json(finalResult)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ride status breakdown' })
  }
}

export const getSeatUtilization = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 14
    
    const result: any[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayRides = await prisma.ride.findMany({
        where: {
          departure: {
            gte: date,
            lt: nextDate
          },
          status: { not: 'CANCELED' }
        },
        include: {
          bookings: true
        }
      })
      
      let availableSeats = 0
      let bookedSeats = 0
      
      for (const ride of dayRides) {
        const rideBooked = ride.bookings.reduce((sum: number, b: any) => sum + (b.seats || 1), 0)
        bookedSeats += rideBooked
        availableSeats += Math.max(0, ride.totalSeats - rideBooked)
      }
      
      result.push({
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        availableSeats,
        bookedSeats,
      })
    }
    
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seat utilization' })
  }
}
