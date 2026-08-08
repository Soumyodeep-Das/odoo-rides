import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api/vehicles/mine
 * Returns the vehicles belonging to the authenticated user.
 */
router.get("/mine", authenticate, async (req: any, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: vehicles });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch vehicles" });
  }
});

/**
 * POST /api/vehicles
 * Employee self-registers a vehicle. Starts as PENDING until admin approves.
 */
router.post("/", authenticate, async (req: any, res) => {
  try {
    const { make, carModel, color, seats, regNo, year } = req.body;

    if (!make || !carModel || !color || !seats || !regNo || !year) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await prisma.vehicle.findUnique({ where: { regNo } });
    if (existing) {
      return res.status(409).json({ error: "Registration number already exists" });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        carModel,
        color,
        year: Number(year),
        seats: Number(seats),
        regNo: regNo.trim().toUpperCase(),
        userId: req.user.id,
        status: "PENDING",
      },
    });

    return res.status(201).json({ success: true, data: vehicle });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to register vehicle" });
  }
});

export default router;

