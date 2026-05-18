import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import userRoutes from "./src/features/user/user.route";
import brandRoutes from "./src/features/brand/brand.route";
import categoryRoutes from "./src/features/category/category.route";
import productRoutes from "./src/features/product/product.route";
import favouriteRoutes from "./src/features/favourite/favourite.route";
import userActivityRoutes from "./src/features/userActivity/userActivity.route";
import cardRoutes from "./src/features/card/card.route";
import permissionRoutes from "./src/features/permission/permission.route";
import paymentRoutes from "./src/features/payment/payment.route";
import addressRoutes from "./src/features/address/address.route";
import phoneOtpRoutes from "./src/features/phoneOtp/phoneOtp.route";
import gmailOtpRoutes from "./src/features/gmailOtp/gmailOtp.route";
import { errorHandler } from "./src/middlewares/errorHandler";

// Import other feature routes here

export const app = express();

// Global Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress response bodies

const rateLimit = require("express-rate-limit"); //Rate limiting

const globalLimiter = rateLimit({
  max: 30,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP",
});

const otpLimiter = rateLimit({
  max: 9,
  windowMs: 1 * 60 * 1000,
  message: "Too many OTP requests from this IP",
});

app.use(globalLimiter);

// API Routes

app.use("/api/user", userRoutes);

app.use("/api/brand", brandRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/product", productRoutes);

app.use("/api/favourite", favouriteRoutes);

app.use("/api/userActivity", userActivityRoutes);

app.use("/api/card", cardRoutes);

app.use("/api/permission", permissionRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/address", addressRoutes);

app.use("/api/phoneOtp", otpLimiter, phoneOtpRoutes);

app.use("/api/gmailOtp", otpLimiter, gmailOtpRoutes);

//Error handler

app.use(errorHandler);

export default app;
