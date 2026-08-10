import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import fs from 'fs';

faker.seed(42);

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });


// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
// //   ssl: {
// //     rejectUnauthorized: true,
// //     // ca: fs.readFileSync("backend/ca.pem").toString(),
// //     ca: `-----BEGIN CERTIFICATE-----
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
// //   },
// ssl: {
//     rejectUnauthorized: false
//   },
// });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Config ────────────────────────────────────────────────────────────────────
const COUNT = 350; // records per table

// ── Helpers ───────────────────────────────────────────────────────────────────
function pick<T>(arr: readonly T[]): T {
  if (arr.length === 0) {
    throw new Error("Cannot pick from an empty array");
  }

  const value = arr[Math.floor(Math.random() * arr.length)];
  if (value === undefined) {
    throw new Error("Picked value was undefined");
  }

  return value;
}

function ids(n: number) {
  return Array.from({ length: n }, () => randomUUID());
}

function offsetDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(faker.number.int({ min: 6, max: 22 }), pick([0, 15, 30, 45]), 0, 0);
  return d;
}

// Unique reg-no generator using a counter prefix to guarantee uniqueness
function makeRegNos(n: number): string[] {
  const states = ["MH", "KA", "DL", "TN", "GJ", "RJ", "UP", "WB"];
  const used = new Set<string>();
  const result: string[] = [];
  while (result.length < n) {
    const state = pick(states);
    const dist = String(faker.number.int({ min: 1, max: 99 })).padStart(2, "0");
    const letters = faker.string.alpha({ length: 2, casing: "upper" });
    const digits = String(faker.number.int({ min: 1000, max: 9999 }));
    const regNo = `${state}${dist}${letters}${digits}`;
    if (!used.has(regNo)) {
      used.add(regNo);
      result.push(regNo);
    }
  }
  return result;
}

function makeEmails(n: number): string[] {
  const used = new Set<string>();
  const result: string[] = [];
  while (result.length < n) {
    const email = faker.internet.email().toLowerCase();
    if (!used.has(email)) {
      used.add(email);
      result.push(email);
    }
  }
  return result;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const VEHICLE_MAKES = ["Maruti", "Hyundai", "Honda", "Tata", "Mahindra", "Toyota", "Kia", "MG"] as const;
const VEHICLE_MODELS = ["Swift", "i20", "City", "Nexon", "Thar", "Innova", "Seltos", "Hector", "Creta", "Verna", "Baleno", "Brezza", "Punch", "Bolero", "Fortuner", "Sonet"];
const COLORS = ["White", "Silver", "Black", "Red", "Blue", "Grey", "Brown", "Green"] as const;
const RIDE_STATUSES = ["SCHEDULED", "ACTIVE", "CANCELED", "COMPLETED"] as const;
const BOOKING_STATUSES = ["CONFIRMED", "CANCELLED"] as const;
const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"] as const;
const PAYMENT_METHODS = ["WALLET", "CASH", "CARD", "UPI"] as const;
const PAYOUT_STATUSES = ["PENDING", "PROCESSING", "DONE", "FAILED"] as const;
const TX_TYPES = ["CREDIT", "DEBIT"] as const;
const INDUSTRIES = ["IT Services", "Software", "Cloud Computing", "Fintech", "E-Commerce", "Consulting", "BPO"];

const LOCATIONS = [
  "Koramangala, Bengaluru", "Whitefield, Bengaluru", "Electronic City, Bengaluru",
  "Indiranagar, Bengaluru", "HSR Layout, Bengaluru", "BTM Layout, Bengaluru",
  "Marathahalli, Bengaluru", "Hebbal, Bengaluru", "Yelahanka, Bengaluru",
  "Jayanagar, Bengaluru", "JP Nagar, Bengaluru", "Rajajinagar, Bengaluru",
  "Malleshwaram, Bengaluru", "Banashankari, Bengaluru", "Kengeri, Bengaluru",
  "Sarjapur, Bengaluru", "Outer Ring Road, Bengaluru", "Bellandur, Bengaluru",
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Starting seed...");

  // 1. Cleanup (reverse dependency order)
  await prisma.walletTransaction.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.orgSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
  console.log("✅ Cleaned existing data");

  // ── Pre-generate all IDs upfront ──────────────────────────────────────────
  const orgIds        = ids(COUNT);
  const orgSettingIds = ids(COUNT);
  const userIds       = ids(COUNT);
  const walletIds     = ids(COUNT);
  const vehicleIds    = ids(COUNT);
  const rideIds       = ids(COUNT);
  const bookingIds    = ids(COUNT);
  const paymentIds    = ids(COUNT);
  const payoutIds     = ids(COUNT);
  const txIds         = ids(COUNT);

  const emails  = makeEmails(COUNT);
  const regNos  = makeRegNos(COUNT);

  // ── 2. Organizations ──────────────────────────────────────────────────────
  await prisma.organization.createMany({
    data: orgIds.map((id, i) => ({
      id,
      name: `${faker.company.name()} ${i}`,
      address: `${faker.location.streetAddress()}, Bengaluru, Karnataka`,
      industry: pick(INDUSTRIES),
      contactEmail: `contact${i}@company${i}.com`,
      contactPhone: `+91${faker.string.numeric(10)}`,
    })),
  });
  console.log(`✅ Created ${COUNT} organizations`);

  // ── 3. OrgSettings (1-to-1 with Org) ──────────────────────────────────────
  await prisma.orgSettings.createMany({
    data: orgIds.map((orgId, i) => ({
      id: orgSettingIds[i],
      orgId,
      fuelCostPerLitre:     faker.number.float({ min: 85,  max: 115, fractionDigits: 2 }),
      costPerKm:            faker.number.float({ min: 3.5, max: 6.5, fractionDigits: 2 }),
      travelAllowancePerKm: faker.number.float({ min: 2,   max: 4.5, fractionDigits: 2 }),
      bookingCutoffMinutes: pick([15, 30, 45, 60]),
    })),
  });
  console.log(`✅ Created ${COUNT} org settings`);

  // ── 4. Users ──────────────────────────────────────────────────────────────
  await prisma.user.createMany({
    data: userIds.map((id, i) => ({
      id,
      orgId:     orgIds[i % orgIds.length],       // spread across orgs
      role:      i % 10 === 0 ? "ADMIN" : "EMPLOYEE",
      name:      faker.person.fullName(),
      email:     emails[i],
      password:  faker.internet.password({ length: 12 }),
      phone:     `+91${faker.string.numeric(10)}`,
      avatarUrl: faker.datatype.boolean({ probability: 0.6 }) ? faker.image.avatarGitHub() : null,
    })),
  });
  console.log(`✅ Created ${COUNT} users`);

  // ── 5. Wallets (1-to-1 with User) ─────────────────────────────────────────
  await prisma.wallet.createMany({
    data: walletIds.map((id, i) => ({
      id,
      userId:  userIds[i],
      balance: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
    })),
  });
  console.log(`✅ Created ${COUNT} wallets`);

  // ── 6. Vehicles (1 per user, all APPROVED so rides can be created) ─────────
  await prisma.vehicle.createMany({
    data: vehicleIds.map((id, i) => {
      const make = pick(VEHICLE_MAKES);
      return {
        id,
        userId:   userIds[i],
        make,
        carModel: pick(VEHICLE_MODELS),
        color:    pick(COLORS),
        year:     faker.number.int({ min: 2015, max: 2024 }),
        seats:    pick([4, 5, 6, 7]),
        regNo:    regNos[i],
        status:   "APPROVED",          // all approved so drivers can post rides
      };
    }),
  });
  console.log(`✅ Created ${COUNT} vehicles`);

  // ── 7. Rides (driver = user[i], vehicle = vehicle[i]) ────────────────────
  const rideData = rideIds.map((id, i) => {
    const status   = pick(RIDE_STATUSES);
    const isPast   = status === "COMPLETED" || status === "CANCELED";
    const daysDelta = faker.number.int({ min: 1, max: 45 });
    const departure = offsetDate(isPast ? -daysDelta : daysDelta);
    const totalSeats    = faker.number.int({ min: 2, max: 6 });
    const availableSeats =
      status === "COMPLETED" ? 0 : faker.number.int({ min: 0, max: totalSeats });

    // two distinct locations
    const pickup  = LOCATIONS[i % LOCATIONS.length];
    const dropoff = LOCATIONS[(i + 5) % LOCATIONS.length];

    return {
      id,
      driverId:       userIds[i],
      vehicleId:      vehicleIds[i],
      pickup,
      dropoff,
      departure,
      totalSeats,
      availableSeats,
      status,
      price: faker.number.float({ min: 30, max: 500, fractionDigits: 2 }),
    };
  });
  await prisma.ride.createMany({ data: rideData });
  console.log(`✅ Created ${COUNT} rides`);

  // ── 8. Bookings (passenger = user[i+1] — offset avoids self-booking) ──────
  const bookingData = bookingIds.map((id, i) => ({
    id,
    passengerId: userIds[(i + 1) % COUNT],   // never the driver (userIds[i])
    rideId:      rideIds[i],
    status:      pick(BOOKING_STATUSES),
    seats:       faker.number.int({ min: 1, max: 2 }),
  }));
  await prisma.booking.createMany({ data: bookingData });
  console.log(`✅ Created ${COUNT} bookings`);

  // ── 9. Payments (1-to-1 with Booking) ────────────────────────────────────
  await prisma.payment.createMany({
    data: paymentIds.map((id, i) => ({
      id,
      bookingId: bookingIds[i],
      amount:    rideData[i].price * bookingData[i].seats,
      currency:  "INR",
      status:    pick(PAYMENT_STATUSES),
      method:    pick(PAYMENT_METHODS),
    })),
  });
  console.log(`✅ Created ${COUNT} payments`);

  // ── 10. Payouts (1-to-1 with Payment) ────────────────────────────────────
  await prisma.payout.createMany({
    data: payoutIds.map((id, i) => {
      const payoutStatus = pick(PAYOUT_STATUSES);
      return {
        id,
        paymentId:   paymentIds[i],
        driverId:    userIds[i],          // driver of ride[i]
        amount:      +(rideData[i].price * 0.9).toFixed(2), // 10% platform fee
        status:      payoutStatus,
        processedAt: payoutStatus === "DONE" ? faker.date.recent({ days: 30 }) : null,
      };
    }),
  });
  console.log(`✅ Created ${COUNT} payouts`);

  // ── 11. Wallet Transactions (1 per booking – passenger debit) ────────────
  await prisma.walletTransaction.createMany({
    data: txIds.map((id, i) => ({
      id,
      walletId:    walletIds[(i + 1) % COUNT],   // passenger's wallet
      type:        "DEBIT" as const,
      amount:      +(rideData[i].price * bookingData[i].seats).toFixed(2),
      description: `Payment for ride booking #${bookingIds[i].slice(0, 8)}`,
      referenceId: bookingIds[i],
    })),
  });
  console.log(`✅ Created ${COUNT} wallet transactions`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n📊 Final counts:");
  const tables = [
    ["Organization",     prisma.organization.count()],
    ["OrgSettings",      prisma.orgSettings.count()],
    ["User",             prisma.user.count()],
    ["Wallet",           prisma.wallet.count()],
    ["Vehicle",          prisma.vehicle.count()],
    ["Ride",             prisma.ride.count()],
    ["Booking",          prisma.booking.count()],
    ["Payment",          prisma.payment.count()],
    ["Payout",           prisma.payout.count()],
    ["WalletTransaction",prisma.walletTransaction.count()],
  ] as const;

  const counts = await Promise.all(tables.map(([, p]) => p));
  tables.forEach(([name], i) => console.log(`   ${name.padEnd(20)} ${counts[i]}`));
  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
