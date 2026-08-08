import { PrismaClient } from '@prisma/client'

// @ts-ignore - Assuming the generated client has the fields based on the API spec
export const prisma = new PrismaClient() as any
