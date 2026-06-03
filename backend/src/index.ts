import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import sellerRoutes from "./routes/seller.js";
import wishlistRoutes from "./routes/wishlist.js";
import reviewRoutes from "./routes/reviews.js";
import vendorRoutes from "./routes/vendors.js";
import uploadRoutes from "./routes/uploads.js";
import notificationRoutes from "./routes/notifications.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./lib/prisma.js";
import { isDemoMode } from "./lib/demoMode.js";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/health/db", async (_req, res) => {
  if (isDemoMode()) {
    res.json({
      status: "ok",
      database: "demo",
      hint: "Using demo catalog. Add Supabase URLs to backend/.env, then run: bash scripts/setup.sh",
    });
    return;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({
      status: "error",
      database: "unavailable",
      hint: "Configure backend/.env with Supabase URLs, then run: bash scripts/setup.sh",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
