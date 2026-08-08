import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

const companySchema = z.object({
  name: z.string(),
  address: z.string(),
  industry: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
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
    const company = await prisma.companySettings.findUnique({ where: { id: 'singleton' } })
    const carpool = await prisma.carpoolConfig.findUnique({ where: { id: 'singleton' } })

    res.json({
      company: company || {
        name: 'Odoo Rides',
        address: '123 Tech Park',
        industry: 'Software',
        contactEmail: 'admin@odoorides.com',
        contactPhone: '1234567890',
        logoUrl: null,
      },
      carpool: carpool || {
        fuelCostPerLitre: 90.0,
        costPerKm: 4.5,
        travelAllowancePerKm: 3.0,
        maxSeatsPerRide: 4,
        bookingCutoffMinutes: 30,
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
}

export const updateCompanySettings = async (req: Request, res: Response) => {
  try {
    const data = companySchema.parse(req.body)
    
    const company = await prisma.companySettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...data },
      update: data,
    })
    
    res.json(company)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: (error as any).errors })
    }
    res.status(500).json({ error: 'Failed to update company settings' })
  }
}

export const updateCarpoolConfig = async (req: Request, res: Response) => {
  try {
    const data = carpoolConfigSchema.parse(req.body)
    
    const carpool = await prisma.carpoolConfig.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...data },
      update: data,
    })
    
    res.json(carpool)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: (error as any).errors })
    }
    res.status(500).json({ error: 'Failed to update carpool config' })
  }
}
