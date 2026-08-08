import { Router } from "express";
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
} from "../controllers/ride.controller.ts";

const router = Router();

// General search and ride creation
router.post("/", createRide);
router.get("/", getRides);

// Specific user ride views (driver & passenger)
router.get("/my-rides/driver/:driverId", getDriverRides);
router.get("/my-rides/passenger/:passengerId", getPassengerRides);

// Single ride operations
router.get("/:id", getRideById);
router.put("/:id", updateRide);
router.patch("/:id", updateRide);
router.patch("/:id/status", updateRideStatus);
router.delete("/:id", deleteRide);

// Booking operations
router.post("/:id/book", bookRide);
router.get("/:id/bookings", getRideBookings);
router.post("/:id/bookings/:bookingId/cancel", cancelBooking);

export default router;
