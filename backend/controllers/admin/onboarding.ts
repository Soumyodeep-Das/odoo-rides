// onboarding controller to create a organisation - will by done by the admin

import type { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import { signToken } from '../../lib/jwt'

const onboardingSchema = z.object({
  // Organisation details
  orgName: z.string().min(2, 'Organisation name must be at least 2 characters'),

  // Admin user details
  adminName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  adminPhone: z.string().min(7),
})

export const onboardOrganisation = async (req: Request, res: Response) => {
  try {
    const data = onboardingSchema.parse(req.body)

    // Prevent duplicate admin emails
    const existing = await prisma.user.findUnique({ where: { email: data.adminEmail } })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const hashedPassword = await Bun.password.hash(data.adminPassword)

    // Create org + admin user atomically
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const org = await tx.organization.create({
        data: { name: data.orgName },
      })

      const admin = await tx.user.create({
        data: {
          orgId: org.id,
          role: 'ADMIN',
          name: data.adminName,
          email: data.adminEmail,
          password: hashedPassword,
          phone: data.adminPhone,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      })

      await tx.wallet.create({ data: { userId: admin.id } })

      return { org, admin }
    })

    const token = signToken({ sub: result.admin.id, role: result.admin.role, orgId: result.org.id })

    res.status(201).json({
      message: 'Organisation onboarded successfully',
      token,
      organisation: { id: result.org.id, name: result.org.name },
      user: result.admin,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.issues })
    }
    res.status(500).json({ error: 'Onboarding failed' })
  }
}
