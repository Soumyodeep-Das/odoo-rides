import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

const companySchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  industry: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
})

const carpoolConfigSchema = z.object({
  fuelCostPerLitre: z.number().min(0),
  costPerKm: z.number().min(0),
  travelAllowancePerKm: z.number().min(0),
  maxSeatsPerRide: z.number().int().min(1),
  bookingCutoffMinutes: z.number().int().min(0),
})

export const getSettings = async (req: Request, res: Response) => {
  try {
    const orgId = req.user!.orgId

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: { settings: true }
    })

    if (!org) {
      return res.status(404).json({ error: 'Organization not found' })
    }

    res.json({
      company: {
        name: org.name,
        address: org.address || '',
        industry: org.industry || '',
        contactEmail: org.contactEmail || '',
        contactPhone: org.contactPhone || '',
        logoUrl: org.logoUrl || '',
      },
      carpool: {
        fuelCostPerLitre: org.settings?.fuelCostPerLitre ?? 90.0,
        costPerKm: org.settings?.costPerKm ?? 4.5,
        travelAllowancePerKm: org.settings?.travelAllowancePerKm ?? 3.0,
        maxSeatsPerRide: org.settings?.maxSeatsPerRide ?? 4,
        bookingCutoffMinutes: org.settings?.bookingCutoffMinutes ?? 30,
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
}

export const updateCompanySettings = async (req: Request, res: Response) => {
  try {
    const orgId = req.user!.orgId
    const data = companySchema.parse(req.body)
    
    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: {
        name: data.name,
        address: data.address || null,
        industry: data.industry || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        logoUrl: data.logoUrl || null,
      }
    })
    
    res.json({
      name: updated.name,
      address: updated.address || '',
      industry: updated.industry || '',
      contactEmail: updated.contactEmail || '',
      contactPhone: updated.contactPhone || '',
      logoUrl: updated.logoUrl || '',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.issues })
    }
    res.status(500).json({ error: 'Failed to update company settings' })
  }
}

export const updateCarpoolConfig = async (req: Request, res: Response) => {
  try {
    const orgId = req.user!.orgId
    const data = carpoolConfigSchema.parse(req.body)
    
    const updated = await prisma.orgSettings.upsert({
      where: { orgId },
      update: {
        fuelCostPerLitre: data.fuelCostPerLitre,
        costPerKm: data.costPerKm,
        travelAllowancePerKm: data.travelAllowancePerKm,
        maxSeatsPerRide: data.maxSeatsPerRide,
        bookingCutoffMinutes: data.bookingCutoffMinutes,
      },
      create: {
        orgId,
        fuelCostPerLitre: data.fuelCostPerLitre,
        costPerKm: data.costPerKm,
        travelAllowancePerKm: data.travelAllowancePerKm,
        maxSeatsPerRide: data.maxSeatsPerRide,
        bookingCutoffMinutes: data.bookingCutoffMinutes,
      }
    })
    
    res.json({
      fuelCostPerLitre: updated.fuelCostPerLitre,
      costPerKm: updated.costPerKm,
      travelAllowancePerKm: updated.travelAllowancePerKm,
      maxSeatsPerRide: updated.maxSeatsPerRide,
      bookingCutoffMinutes: updated.bookingCutoffMinutes,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.issues })
    }
    res.status(500).json({ error: 'Failed to update carpool config' })
  }
}
