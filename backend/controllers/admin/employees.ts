import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import { signToken } from '../../lib/jwt'
import { sendInviteEmail } from '../../lib/mailer'

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
    const orgId = req.user!.orgId
    const employees = await prisma.user.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(employees.map(mapEmployee))
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

    // Use the admin's orgId from JWT — no more findFirst hack
    const orgId = req.user!.orgId

    const employee = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE',
        password: '', // will be set by employee via magic link
        phone: data.phone || '987654321',
        orgId,
      },
    })

    // Generate a 24h invite token and send the magic link
    const inviteToken = signToken({ sub: employee.id, role: employee.role, orgId }, '24h')
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
    const magicLink = `${frontendUrl}/employee-onboard?token=${inviteToken}`

    console.log(magicLink)

    // Send email async — don't block the response, but log clearly if it fails
    sendInviteEmail(employee.email, employee.name, magicLink)
      .then(() => console.log(`[mailer] Invite sent to ${employee.email}`))
      .catch((err) => console.error(`[mailer] Failed to send to ${employee.email}:`, err?.message ?? err))

    // Return the magic link so admin can share it manually if email fails
    res.status(201).json({ ...mapEmployee(employee), magicLink })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.issues })
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
