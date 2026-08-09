import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { signToken, verifyToken } from '../lib/jwt'
import { z } from 'zod'
import path from 'node:path'

// ── Schemas ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeUser(user: {
  id: string
  name: string
  email: string
  phone: string
  role: string
  orgId: string
  avatarUrl: string | null
  createdAt: Date
  org?: { settings?: { costPerKm: number } | null }
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    orgId: user.orgId,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    orgSettings: user.org?.settings ? { costPerKm: user.org.settings.costPerKm } : undefined,
  }
}

// ── Controllers ───────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { org: { include: { settings: true } } }
    })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Employees who have not yet completed onboarding have an empty password
    if (!user.password) {
      return res.status(403).json({ error: 'Account not yet activated. Please check your invite email.' })
    }

    const valid = await Bun.password.verify(data.password, user.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken({ sub: user.id, role: user.role, orgId: user.orgId })
    res.json({ token, user: safeUser(user) })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.issues })
    }
    res.status(500).json({ error: 'Login failed' })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { org: { include: { settings: true } } }
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(safeUser(user))
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
}

/**
 * Employee onboarding — called after clicking magic link.
 * Accepts multipart/form-data: token, password, phone, and optionally an avatar file.
 * Verifies invite token, sets password + phone, stores avatar URL, returns auth JWT.
 */
export const employeeOnboard = async (req: Request, res: Response) => {
  try {
    const { token, password, phone } = req.body as {
      token?: string
      password?: string
      phone?: string
    }

    if (!token) return res.status(400).json({ error: 'Invite token is required' })
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ error: 'A valid phone number is required' })
    }

    // Verify invite token
    let payload: ReturnType<typeof verifyToken>
    try {
      payload = verifyToken(token)
    } catch {
      return res.status(400).json({ error: 'Invite link is invalid or has expired' })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    // If they already have a password, the link has been used
    if (user.password) {
      return res.status(409).json({ error: 'This invite link has already been used. Please log in.' })
    }

    const hashedPassword = await Bun.password.hash(password)

    // Build avatar URL if a file was uploaded by multer
    const file = (req as any).file as Express.Multer.File | undefined
    const avatarUrl = file
      ? `/uploads/${path.basename(file.path)}`
      : null

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        phone: phone.trim(),
        ...(avatarUrl ? { avatarUrl } : {}),
      },
      include: { org: { include: { settings: true } } }
    })

    const authToken = signToken({ sub: updated.id, role: updated.role, orgId: updated.orgId })
    res.json({ token: authToken, user: safeUser(updated) })
  } catch {
    res.status(500).json({ error: 'Employee onboarding failed' })
  }
}
