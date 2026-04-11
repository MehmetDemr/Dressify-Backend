import { Router } from "express";
import {
  createActivity,
  getUserActivities,
  getActivityById,
  getAllActivities,
  deleteActivity,
} from "./userActivity.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.model";

const router = Router();

router.use(authenticate as any);

router.get("/", getUserActivities as any);
router.get("/:id", getActivityById as any);
router.post("/", createActivity as any);
router.delete("/:id", deleteActivity as any);

// Admin only
router.get("/admin/all", authorize(Role.ADMIN) as any, getAllActivities as any); // All activities

export default router;
