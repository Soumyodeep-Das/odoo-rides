import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

const addVehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  licensePlate: z.string(),
  ownerId: z.string(),
  seats: z.number().int().min(1).max(12),
  color: z.string().default('N/A'),
})

const mapVehicle = (v: any) => ({
  id: v.id,
  make: v.make,
  model: v.carModel,
  licensePlate: v.regNo,
  ownerId: v.userId,
  ownerName: v.user?.name || 'Unknown',
  seats: v.seats,
  status: v.status?.toLowerCase() || 'pending',
  registeredAt: v.createdAt,
})

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const orgId = req.user!.orgId
    const vehicles = await prisma.vehicle.findMany({
      where: { user: { orgId } },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(vehicles.map(mapVehicle))
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
    // Ensure the owner belongs to the same org as the requesting admin
    if (owner.orgId !== req.user!.orgId) {
      return res.status(403).json({ error: 'Owner does not belong to your organisation' })
    }

    const existing = await prisma.vehicle.findUnique({ where: { regNo: data.licensePlate } })
    if (existing) {
      return res.status(409).json({ error: 'License plate already registered' })
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make: data.make,
        carModel: data.model,
        regNo: data.licensePlate,
        seats: data.seats,
        userId: data.ownerId,
        color: data.color,
      }
    })

    res.status(201).json(mapVehicle({ ...vehicle, user: owner }))
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

    const lowerStatus = status?.toLowerCase();
    if (!['pending', 'approved', 'rejected', 'inactive'].includes(lowerStatus)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { status: lowerStatus.toUpperCase() as any },
      include: { user: { select: { name: true } } }
    })

    res.json(mapVehicle(vehicle))
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
