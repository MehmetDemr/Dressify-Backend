import { Router } from "express";
import { register, login, getMe, deleteMe } from "./user.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "./user.model";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", authenticate, getMe);

router.delete("/:id", authenticate, deleteMe);

// Admin only route
router.get("/admin", authenticate, authorize(Role.ADMIN), (req, res) => {
  res.json({ success: true, message: "Welcome to admin panel." });
});

export default router;
