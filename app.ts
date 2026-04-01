import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import userRoutes from "./src/features/user/user.route";
import brandRoutes from "./src/features/brand/brand.route";
import categoryRoutes from "./src/features/category/category.route";
import productRoutes from "./src/features/product/product.route";
import favouriteRoutes from "./src/features/favourite/favourite.route";
import { errorHandler } from "./src/middlewares/errorHandler";

// Import other feature routes here

export const app = express();

// Global Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress response bodies

// API Routes

app.use("/api/user", userRoutes);

app.use("/api/brand", brandRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/product", productRoutes);

app.use("/api/favourite", favouriteRoutes);

//app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes);

//Error handler

app.use(errorHandler);

export default app;
