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

export default router;
