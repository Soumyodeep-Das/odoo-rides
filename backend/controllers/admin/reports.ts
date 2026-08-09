import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export const getReportSummary = async (req: Request, res: Response) => {
  try {
    const orgId = req.user!.orgId

    const totalRides = await prisma.ride.count({
      where: { status: { not: 'CANCELED' }, driver: { orgId } }
    })
    const totalEmployees = await prisma.user.count({ where: { orgId } })
    const totalVehicles = await prisma.vehicle.count({ where: { user: { orgId } } })
    const totalBookings = await prisma.booking.count({
      where: { ride: { driver: { orgId } } }
    })

    const bookings = await prisma.booking.findMany({
      where: { ride: { driver: { orgId } } },
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
    const orgId = req.user!.orgId
    const days = parseInt(req.query.days as string) || 14
    const result: any[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const ridesCount = await prisma.ride.count({
        where: { departure: { gte: date, lt: nextDate }, driver: { orgId } }
      })
      const dayBookings = await prisma.booking.findMany({
        where: { ride: { departure: { gte: date, lt: nextDate }, driver: { orgId } } }
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
    const orgId = req.user!.orgId
    const groups = await prisma.ride.groupBy({
      by: ['status'],
      where: { driver: { orgId } },
      _count: { _all: true }
    })
    const mapped = groups.map((g: any) => ({ status: g.status.toLowerCase(), count: g._count._all }))
    const finalResult = [
      { status: 'active', count: (mapped.find((m: any) => m.status === 'scheduled')?.count || 0) + (mapped.find((m: any) => m.status === 'active')?.count || 0) },
      { status: 'completed', count: mapped.find((m: any) => m.status === 'completed')?.count || 0 },
      { status: 'cancelled', count: mapped.find((m: any) => m.status === 'canceled')?.count || 0 },
      { status: 'full', count: 0 },
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
