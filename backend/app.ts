import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.routes.js";
import rideRoutes from "./routes/ride.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Base api router
const apiRouter = express.Router();

// Mount routes
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/rides", rideRoutes);

app.use("/api", apiRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
