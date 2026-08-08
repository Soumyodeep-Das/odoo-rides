import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

const addEmployeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  // department: z.string().optional(),
  role: z.enum(['admin', 'employee', 'ADMIN', 'EMPLOYEE']),
  // location: z.string().optional(),
  phone: z.string().optional(),
})

const mapEmployee = (emp: any) => ({
  id: emp.id,
  name: emp.name,
  email: emp.email,
  // department: 'General',
  // location: 'HQ',
  role: emp.role === 'ADMIN' ? 'admin' : 'employee',
  // status: 'active',
  joinedAt: emp.createdAt,
  phone: emp.phone,
})

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    const mapped = employees.map(mapEmployee)
    
    res.json(mapped)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
}

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const data = addEmployeeSchema.parse(req.body)
    
    // Check if email exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Creating a mock org for now if needed, or assuming they pass orgId
    // Since schema expects orgId, let's just assume we have a default org for admin context
    let defaultOrg = await prisma.organization.findFirst()
    if (!defaultOrg) {
      defaultOrg = await prisma.organization.create({ data: { name: 'Default Org' } })
    }

    const employee = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
        password: 'temporaryPassword123', // Dummy password for now
        phone: data.phone || '0000000000',
        orgId: defaultOrg.id,
      },
    })
    res.status(201).json(mapEmployee(employee))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: (error as any).errors })
    }
    res.status(500).json({ error: 'Failed to add employee' })
  }
}

export const toggleEmployeeAccess = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const employee = await prisma.user.findUnique({ where: { id } })
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    
    // Status not in DB, mock toggle for frontend
    res.json({ ...mapEmployee(employee), status: 'revoked' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle access' })
  }
}

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.user.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' })
  }
}
