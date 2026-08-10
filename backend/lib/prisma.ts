import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import fs from 'fs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// const pool = new pg.Pool({
//     connectionString: process.env.DATABASE_URL,
// //     ssl: {
// //         rejectUnauthorized: true,
// //         // ca: fs.readFileSync("backend/ca.pem").toString(), 
// //         ca: `-----BEGIN CERTIFICATE-----
// // MIIBxDCCAWqgAwIBAgIUJTnv2XU2/7YScrEwkVrJ6WiKCsEwCgYIKoZIzj0EAwMw
// // QDE+MDwGA1UEAww1YjA5MDcxNDYtNjNhMy00YzNlLWFiMDEtYTgyNWMyYWU3YTll
// // IFByb2plY3QgQ0EgR0VOIDIwHhcNMjYwNzI4MDEzODMzWhcNMzYwNzI1MDEzODMz
// // WjBAMT4wPAYDVQQDDDViMDkwNzE0Ni02M2EzLTRjM2UtYWIwMS1hODI1YzJhZTdh
// // OWUgUHJvamVjdCBDQSBHRU4gMjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABDLO
// // F9uL1+8r/hrFb0frf5HQoOErijAEZrlZaMw3ayqLB5Pt70DjxAGG7tjIuZ4dxEp1
// // 4KANHaeceKJLCGtYUVOjQjBAMB0GA1UdDgQWBBSwunxAV7glxY40GjaJBFLLST+w
// // 3DASBgNVHRMBAf8ECDAGAQH/AgEAMAsGA1UdDwQEAwIBBjAKBggqhkjOPQQDAwNI
// // ADBFAiBTDTi+5oTv61IQUATZJgOsOnzxcS0ttKjcCAaZwHmSagIhAOyMzN9WNAiu
// // yT8X3LO6X1FFz+3Fvw5+AWdRMyOOVCg4
// // -----END CERTIFICATE-----
// // `,
// //     },
// ssl: {
//     rejectUnauthorized: false
//   },
// });

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
