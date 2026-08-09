import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createRide,
  getRides,
  getRideById,
  updateRide,
  updateRideStatus,
  deleteRide,
  bookRide,
  cancelBooking,
  getRideBookings,
  getDriverRides,
  getPassengerRides,
  verifyBookingPayment
} from "../controllers/ride.controller.ts";

const router = Router();

// General search and ride creation
router.post("/", authenticate, createRide);
router.get("/", authenticate, getRides);

// Specific user ride views (driver & passenger)
router.get("/my-rides/driver/:driverId", authenticate, getDriverRides);
router.get("/my-rides/passenger/:passengerId", authenticate, getPassengerRides);

// Single ride operations
router.get("/:id", authenticate, getRideById);
router.put("/:id", authenticate, updateRide);
router.patch("/:id", authenticate, updateRide);
router.patch("/:id/status", authenticate, updateRideStatus);
router.delete("/:id", authenticate, deleteRide);

// Booking operations
router.post("/:id/book", authenticate, bookRide);
router.get("/:id/bookings", authenticate, getRideBookings);
router.post("/:id/bookings/:bookingId/cancel", authenticate, cancelBooking);
router.post("/:id/bookings/:bookingId/verify", authenticate, verifyBookingPayment);

export default router;
