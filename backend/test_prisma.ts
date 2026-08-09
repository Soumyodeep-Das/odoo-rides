import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config()
const prisma = new PrismaClient()
prisma.user.findMany().then(res => { console.log("SUCCESS", res); process.exit(0) }).catch(err => { console.error("ERROR", err); process.exit(1) })
