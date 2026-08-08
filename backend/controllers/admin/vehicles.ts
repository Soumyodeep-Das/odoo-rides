import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

const addVehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  licensePlate: z.string(),
  ownerId: z.string(),
  seats: z.number().int().min(1).max(12),
})

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        user: { select: { name: true } } // include ownerName
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Map data to match frontend expectations (ownerName)
    const formatted = vehicles.map((v: any) => ({
      ...v,
      ownerName: v.user?.name || 'Unknown',
    }))
    
    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' })
  }
}

export const addVehicle = async (req: Request, res: Response) => {
  try {
    const data = addVehicleSchema.parse(req.body)
    
    const owner = await prisma.user.findUnique({ where: { id: data.ownerId } })
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' })
    }

    const existing = await prisma.vehicle.findUnique({ where: { regNo: data.licensePlate } })
    if (existing) {
      return res.status(409).json({ error: 'License plate already registered' })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make: data.make,
        carModel: data.model, // Mapping frontend 'model' to schema 'carModel'
        year: data.year,
        regNo: data.licensePlate, // Mapping frontend 'licensePlate' to schema 'regNo'
        seats: data.seats,
        userId: data.ownerId,
        color: 'Default Color', // Assuming this is needed by schema
      }
    })
    
    res.status(201).json(vehicle)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: (error as any).errors })
    }
    res.status(500).json({ error: 'Failed to add vehicle' })
  }
}

export const updateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    if (!['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'].includes(status?.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { status: status.toUpperCase() },
    })
    
    res.json(vehicle)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle status' })
  }
}

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.vehicle.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' })
  }
}
