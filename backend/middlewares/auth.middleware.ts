import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt'

// Extend Express Request to carry the decoded user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
        orgId: string
      }
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorised' })
  }

  const token = header.slice(7)
  try {
    const payload = verifyToken(token)
    req.user = { id: payload.sub, role: payload.role, orgId: payload.orgId }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
