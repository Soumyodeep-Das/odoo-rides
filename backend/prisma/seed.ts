import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // 1. Clean up existing data (in reverse order of dependencies)
  await prisma.walletTransaction.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // 2. Create an Organization
  const org = await prisma.organization.create({
    data: {
      name: "Tech Corp India",
    },
  });
  console.log(`Created Organization: ${org.name}`);

  // 3. Create Users (Driver and Passenger)
  const driver = await prisma.user.create({
    data: {
      orgId: org.id,
      role: "EMPLOYEE",
      name: "Rahul Sharma",
      email: "rahul.driver@techcorp.com",
      password: "hashed_password_123",
      phone: "+919876543210",
      wallet: {
        create: {
          balance: 500.0, // Initial wallet balance
        },
      },
    },
    include: { wallet: true },
  });

  const passenger = await prisma.user.create({
    data: {
      orgId: org.id,
      role: "EMPLOYEE",
      name: "Priya Patel",
      email: "priya.passenger@techcorp.com",
      password: "hashed_password_456",
      phone: "+919876543211",
      wallet: {
        create: {
          balance: 1000.0,
        },
      },
    },
    include: { wallet: true },
  });
  console.log("Created Users and Wallets");

  // 4. Create a Vehicle for the Driver
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: driver.id,
      carModel: "City",
      make: "Honda",
      color: "White",
      seats: 4,
      regNo: "MH12AB1234",
    },
  });
  console.log(`Created Vehicle: ${vehicle.make} ${vehicle.carModel}`);

  // 5. Create a Ride scheduled for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const ride = await prisma.ride.create({
    data: {
      driverId: driver.id,
      vehicleId: vehicle.id,
      pickup: "Tech Park Phase 1",
      dropoff: "Koramangala",
      departure: tomorrow,
      totalSeats: 3,
      availableSeats: 2, // 1 seat will be booked below
      status: "SCHEDULED",
      price: 150.0,
    },
  });
  console.log("Created Ride");

  // 6. Create a Booking, Payment, and Payout
  const booking = await prisma.booking.create({
    data: {
      passengerId: passenger.id,
      rideId: ride.id,
      status: "CONFIRMED",
      seats: 1,
      payment: {
        create: {
          amount: 150.0,
          currency: "INR",
          status: "SUCCESS",
          method: "WALLET",
          payout: {
            create: {
              driverId: driver.id,
              amount: 140.0, // Assuming 10 INR platform fee
              status: "PENDING",
            },
          },
        },
      },
    },
    include: {
      payment: true,
    },
  });
  console.log("Created Booking, Payment, and pending Payout");

  // 7. Record Wallet Transactions
  if (passenger.wallet && driver.wallet && booking.payment) {
    // Deduct from Passenger
    await prisma.walletTransaction.create({
      data: {
        walletId: passenger.wallet.id,
        type: "DEBIT",
        amount: 150.0,
        description: `Payment for ride ${ride.id}`,
        referenceId: booking.id,
      },
    });

    // Update Passenger Wallet Balance
    await prisma.wallet.update({
      where: { id: passenger.wallet.id },
      data: { balance: { decrement: 150.0 } },
    });

    // Credit to Driver (using the payout amount)
    await prisma.walletTransaction.create({
      data: {
        walletId: driver.wallet.id,
        type: "CREDIT",
        amount: 140.0,
        description: `Payout for booking ${booking.id}`,
        referenceId: booking.payment.id,
      },
    });

    // Update Driver Wallet Balance
    await prisma.wallet.update({
      where: { id: driver.wallet.id },
      data: { balance: { increment: 140.0 } },
    });
    console.log("Processed Wallet Transactions");
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
