import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.routes.ts";
import { authenticate, requireRole } from "./middlewares/auth.middleware.js";
import { onboardOrganisation } from "./controllers/admin/onboarding.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  credentials: true,
}));
app.use(compression());
app.use(express.json());

// Serve uploaded avatar images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Base api router
const apiRouter = express.Router();

// Mount routes
apiRouter.use("/auth", authRoutes);
apiRouter.post("/admin/onboarding", onboardOrganisation); // public — issues the first JWT
apiRouter.use("/admin", authenticate, requireRole("ADMIN"), adminRoutes);
apiRouter.use("/payments", paymentRoutes);

app.use("/api", apiRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
