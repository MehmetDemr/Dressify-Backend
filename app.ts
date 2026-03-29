import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import userRoutes from "./src/features/user/user.route";
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

//app.use("/api/auth", authRoutes);
//app.use("/api/users", userRoutes);

//Error handler

app.use(errorHandler);

export default app;
