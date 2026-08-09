import type { Request, Response } from "express";
import { z } from "zod";
import {
  RideStatus,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  WalletTransactionType,
} from "@prisma/client";
import { prisma } from "../lib/prisma";

// Zod Validation Schemas
const createRideSchema = z.object({
  driverId: z.uuid("Invalid driver ID format"),
  vehicleId: z.uuid("Invalid vehicle ID format"),
  pickup: z.string().min(2, "Pickup location is required"),
  dropoff: z.string().min(2, "Dropoff location is required"),
  departure: z.iso.datetime({
    message: "Departure must be a valid ISO date string",
  }),
  totalSeats: z
    .number()
    .int()
    .min(1, "Total seats must be at least 1")
    .max(10, "Total seats cannot exceed 10"),
  distance: z.number().min(0, "Distance cannot be negative"),
});

const updateRideSchema = z.object({
  pickup: z.string().min(2).optional(),
  dropoff: z.string().min(2).optional(),
  departure: z.iso.datetime().optional(),
  totalSeats: z.number().int().min(1).max(10).optional(),
});

const updateRideStatusSchema = z.object({
  status: z.nativeEnum(RideStatus),
});

const bookRideSchema = z.object({
  passengerId: z.uuid("Invalid passenger ID format"),
  seats: z.number().int().min(1, "Must book at least 1 seat").default(1),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.WALLET),
});

/**
 * 1. Create a new Ride (Offer a Ride)
 * POST /api/rides
 */
export const createRide = async (req: Request, res: Response) => {
  try {
    const data = createRideSchema.parse(req.body);

    const departureDate = new Date(data.departure);
    if (departureDate <= new Date()) {
      return res
        .status(400)
        .json({ error: "Departure time must be in the future" });
    }

    // Verify driver exists
    const driver = await prisma.user.findUnique({
      where: { id: data.driverId },
      include: { org: { include: { settings: true } } },
    });
    if (!driver) {
      return res.status(404).json({ error: "Driver user not found" });
    }

    const costPerKm = driver.org?.settings?.costPerKm ?? 4.5;
    const price = Math.max(0, Math.round(data.distance * costPerKm));

    // Verify vehicle exists and belongs to driver
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    if (vehicle.userId !== data.driverId) {
      return res
        .status(400)
        .json({ error: "Vehicle does not belong to the driver" });
    }

    // Check vehicle seats capacity
    if (data.totalSeats > vehicle.seats) {
      return res.status(400).json({
        error: `Total seats offered (${data.totalSeats}) cannot exceed vehicle seat capacity (${vehicle.seats})`,
      });
    }

    const ride = await prisma.ride.create({
      data: {
        driverId: data.driverId,
        vehicleId: data.vehicleId,
        pickup: data.pickup,
        dropoff: data.dropoff,
        departure: departureDate,
        totalSeats: data.totalSeats,
        availableSeats: data.totalSeats,
        price,
        status: RideStatus.SCHEDULED,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            orgId: true,
          },
        },
        vehicle: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Ride created successfully",
      data: ride,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation Error", details: error });
    }
    console.error("Error creating ride:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to create ride" });
  }
};

/**
 * 2. Search & List Rides
 * GET /api/rides
 * Query params: pickup, dropoff, date, status, driverId, orgId, minSeats, minPrice, maxPrice, page, limit
 */
export const getRides = async (req: Request, res: Response) => {
  try {
    const {
      pickup,
      dropoff,
      date,
      status = RideStatus.SCHEDULED,
      driverId,
      orgId,
      minSeats = "1",
      minPrice,
      maxPrice,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(
      1,
      Math.min(100, parseInt(limit as string, 10) || 10),
    );
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (pickup) {
      where.pickup = { contains: pickup as string, mode: "insensitive" };
    }

    if (dropoff) {
      where.dropoff = { contains: dropoff as string, mode: "insensitive" };
    }

    if (status && status !== "ALL") {
      where.status = status as RideStatus;
    }

    if (driverId) {
      where.driverId = driverId as string;
    }

    if (orgId) {
      where.driver = { orgId: orgId as string };
    }

    if (minSeats) {
      where.availableSeats = { gte: parseInt(minSeats as string, 10) || 1 };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (date) {
      const searchDate = new Date(date as string);
      if (!isNaN(searchDate.getTime())) {
        const startOfDay = new Date(searchDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(searchDate);
        endOfDay.setHours(23, 59, 59, 999);

        where.departure = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }
    }

    const [total, rides] = await Promise.all([
      prisma.ride.count({ where }),
      prisma.ride.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { departure: "asc" },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              orgId: true,
              org: { select: { id: true, name: true } },
            },
          },
          vehicle: {
            select: {
              id: true,
              make: true,
              carModel: true,
              color: true,
              regNo: true,
              seats: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: rides,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Error fetching rides:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch rides" });
  }
};

/**
 * 3. Get Single Ride Details
 * GET /api/rides/:id
 */
export const getRideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ride = await prisma.ride.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            orgId: true,
            org: { select: { id: true, name: true } },
          },
        },
        vehicle: true,
        bookings: {
          include: {
            passenger: {
              select: { id: true, name: true, email: true, phone: true },
            },
            payment: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    return res.json({
      success: true,
      data: ride,
    });
  } catch (error: any) {
    console.error("Error fetching ride:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch ride" });
  }
};

/**
 * 4. Update Ride Details
 * PUT / PATCH /api/rides/:id
 */
export const updateRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateRideSchema.parse(req.body);

    const existingRide = await prisma.ride.findUnique({
      where: { id },
    });

    if (!existingRide) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (existingRide.status !== RideStatus.SCHEDULED) {
      return res.status(400).json({
        error: `Cannot update ride in '${existingRide.status}' status. Only SCHEDULED rides can be modified.`,
      });
    }

    const updateData: any = {};
    if (data.pickup) updateData.pickup = data.pickup;
    if (data.dropoff) updateData.dropoff = data.dropoff;

    if (data.departure) {
      const departureDate = new Date(data.departure);
      if (departureDate <= new Date()) {
        return res
          .status(400)
          .json({ error: "Departure time must be in the future" });
      }
      updateData.departure = departureDate;
    }

    if (data.totalSeats !== undefined) {
      const currentlyBookedSeats =
        existingRide.totalSeats - existingRide.availableSeats;
      if (data.totalSeats < currentlyBookedSeats) {
        return res.status(400).json({
          error: `Cannot reduce total seats to ${data.totalSeats} because ${currentlyBookedSeats} seats are already booked`,
        });
      }
      updateData.totalSeats = data.totalSeats;
      updateData.availableSeats = data.totalSeats - currentlyBookedSeats;
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: updateData,
      include: {
        driver: { select: { id: true, name: true, email: true, phone: true } },
        vehicle: true,
      },
    });

    return res.json({
      success: true,
      message: "Ride updated successfully",
      data: updatedRide,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation Error", details: error.issues });
    }
    console.error("Error updating ride:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to update ride" });
  }
};

/**
 * 5. Update Ride Status
 * PATCH /api/rides/:id/status
 */
export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status: targetStatus } = updateRideStatusSchema.parse(req.body);

    const existingRide = await prisma.ride.findUnique({
      where: { id },
    });

    if (!existingRide) {
      return res.status(404).json({ error: "Ride not found" });
    }

    const currentStatus = existingRide.status;

    // Validate state transition logic
    if (
      currentStatus === RideStatus.COMPLETED ||
      currentStatus === RideStatus.CANCELED
    ) {
      return res.status(400).json({
        error: `Ride is already ${currentStatus} and status cannot be changed`,
      });
    }

    if (
      currentStatus === RideStatus.SCHEDULED &&
      targetStatus === RideStatus.COMPLETED
    ) {
      return res.status(400).json({
        error: "Ride must be set to ACTIVE before marking as COMPLETED",
      });
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: { status: targetStatus },
    });

    return res.json({
      success: true,
      message: `Ride status updated to ${targetStatus}`,
      data: updatedRide,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation Error", details: error.issues });
    }
    console.error("Error updating ride status:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to update ride status" });
  }
};

/**
 * 6. Delete / Cancel Ride
 * DELETE /api/rides/:id
 */
export const deleteRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingRide = await prisma.ride.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });

    if (!existingRide) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (existingRide._count.bookings > 0) {
      // If bookings exist, change status to CANCELED instead of hard delete
      const canceledRide = await prisma.ride.update({
        where: { id },
        data: { status: RideStatus.CANCELED },
      });
      return res.json({
        success: true,
        message: "Ride has active bookings. Status updated to CANCELED.",
        data: canceledRide,
      });
    }

    await prisma.ride.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Ride deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting ride:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to delete ride" });
  }
};

/**
 * 7. Book Seats on a Ride
 * POST /api/rides/:id/book
 */
export const bookRide = async (req: Request, res: Response) => {
  try {
    const { id: rideId } = req.params;
    const data = bookRideSchema.parse(req.body);

    // Verify passenger user exists
    const passenger = await prisma.user.findUnique({
      where: { id: data.passengerId },
      include: { wallet: true },
    });
    if (!passenger) {
      return res.status(404).json({ error: "Passenger user not found" });
    }

    // Verify ride exists
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== RideStatus.SCHEDULED) {
      return res.status(400).json({
        error: `Cannot book ride in '${ride.status}' status. Only SCHEDULED rides can be booked.`,
      });
    }

    if (ride.driverId === data.passengerId) {
      return res
        .status(400)
        .json({ error: "Drivers cannot book their own ride" });
    }

    if (ride.availableSeats < data.seats) {
      return res.status(400).json({
        error: `Not enough available seats. Requested: ${data.seats}, Available: ${ride.availableSeats}`,
      });
    }

    // Check if passenger already has a CONFIRMED booking for this ride
    const existingBooking = await prisma.booking.findFirst({
      where: {
        rideId,
        passengerId: data.passengerId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "Passenger already has an active booking for this ride",
      });
    }

    const totalAmount = Number(ride.price) * data.seats;

    // Execute atomic transaction for booking & payment creation
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Decrement available seats
      const updatedRide = await tx.ride.update({
        where: { id: rideId },
        data: { availableSeats: { decrement: data.seats } },
      });

      // 2. Create Booking record
      const booking = await tx.booking.create({
        data: {
          rideId,
          passengerId: data.passengerId,
          seats: data.seats,
          status: BookingStatus.CONFIRMED,
        },
      });

      // 3. Handle Wallet balance if WALLET payment method selected
      let paymentStatus: PaymentStatus = PaymentStatus.PENDING;
      if (data.paymentMethod === PaymentMethod.WALLET) {
        let wallet = passenger.wallet;
        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId: data.passengerId, balance: 0 },
          });
        }

        if (Number(wallet.balance) < totalAmount) {
          throw new Error(
            `Insufficient wallet balance. Required: ₹${totalAmount}, Available: ₹${wallet.balance}`,
          );
        }

        // Deduct balance & create wallet transaction
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { decrement: totalAmount } },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: WalletTransactionType.DEBIT,
            amount: totalAmount,
            description: `Payment for Ride #${(rideId as string).substring(0, 8)} (${data.seats} seat/s)`,
            referenceId: booking.id,
          },
        });

        paymentStatus = PaymentStatus.SUCCESS;
      } else {
        paymentStatus = PaymentStatus.SUCCESS;
      }

      // 4. Create Payment record
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalAmount,
          currency: "INR",
          status: paymentStatus,
          method: data.paymentMethod,
        },
      });

      return { booking, payment, availableSeats: updatedRide.availableSeats };
    });

    return res.status(201).json({
      success: true,
      message: "Ride booked successfully",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation Error", details: error.issues });
    }
    console.error("Error booking ride:", error);
    return res
      .status(400)
      .json({ error: error.message || "Failed to book ride" });
  }
};

/**
 * 8. Cancel a Booking
 * POST /api/rides/:id/bookings/:bookingId/cancel
 */
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id: rideId, bookingId } = req.params;

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, rideId },
      include: { payment: true, ride: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found for this ride" });
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CANCELLED },
      });

      // 2. Restore available seats on ride
      await tx.ride.update({
        where: { id: rideId },
        data: { availableSeats: { increment: booking.seats } },
      });

      // 3. Process refund if payment exists and was successful
      if (booking.payment && booking.payment.status === PaymentStatus.SUCCESS) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { status: PaymentStatus.REFUNDED },
        });

        // Refund wallet balance if paid via WALLET
        if (booking.payment.method === PaymentMethod.WALLET) {
          const wallet = await tx.wallet.findUnique({
            where: { userId: booking.passengerId },
          });
          if (wallet) {
            await tx.wallet.update({
              where: { id: wallet.id },
              data: { balance: { increment: booking.payment.amount } },
            });

            await tx.walletTransaction.create({
              data: {
                walletId: wallet.id,
                type: WalletTransactionType.CREDIT,
                amount: booking.payment.amount,
                description: `Refund for cancelled Ride ${(rideId as string).substring(0, 8)}`,
                referenceId: booking.id,
              },
            });
          }
        }
      }

      return updatedBooking;
    });

    return res.json({
      success: true,
      message: "Booking cancelled successfully and seats restored",
      data: result,
    });
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to cancel booking" });
  }
};

/**
 * 9. Get Bookings for a Ride
 * GET /api/rides/:id/bookings
 */
export const getRideBookings = async (req: Request, res: Response) => {
  try {
    const { id: rideId } = req.params;

    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { rideId },
      include: {
        passenger: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            orgId: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error("Error fetching ride bookings:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch ride bookings" });
  }
};

/**
 * 10. Get My Offered Rides (Driver View)
 * GET /api/rides/my-rides/driver/:driverId
 */
export const getDriverRides = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { status } = req.query;

    const where: any = { driverId };
    if (status && status !== "ALL") {
      where.status = status as RideStatus;
    }

    const rides = await prisma.ride.findMany({
      where,
      include: {
        vehicle: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { departure: "desc" },
    });

    return res.json({
      success: true,
      data: rides,
    });
  } catch (error: any) {
    console.error("Error fetching driver rides:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch driver rides" });
  }
};

/**
 * 11. Get My Booked Rides (Passenger View)
 * GET /api/rides/my-rides/passenger/:passengerId
 */
export const getPassengerRides = async (req: Request, res: Response) => {
  try {
    const { passengerId } = req.params;
    const { status } = req.query;

    const where: any = { passengerId };
    if (status && status !== "ALL") {
      where.status = status as BookingStatus;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        ride: {
          include: {
            driver: {
              select: { id: true, name: true, email: true, phone: true },
            },
            vehicle: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error("Error fetching passenger rides:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch passenger rides" });
  }
};
