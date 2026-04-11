import { Router } from "express";
import { register, login, getMe, deleteMe, googleAuthController, googleCallbackController, appleCallbackController, appleAuthController } from "./user.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "./user.model";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", authenticate as any, getMe);

router.delete("/:id", authenticate as any, deleteMe);

// Admin only route
router.get(
  "/admin",
  authenticate as any,
  authorize(Role.ADMIN) as any,
  (req, res) => {
    res.json({ success: true, message: "Welcome to admin panel." });
  },
);

router.get("/google", googleAuthController);
router.get("/google/callback", googleCallbackController);

router.get("/apple", appleAuthController);
router.post("/apple/callback", appleCallbackController);

export default router;
