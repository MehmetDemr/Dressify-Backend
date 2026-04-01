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

router.use(authenticate);

router.get("/", getUserActivities);
router.get("/:id", getActivityById);
router.post("/", createActivity);
router.delete("/:id", deleteActivity);

// Admin only
router.get("/admin/all", authorize(Role.ADMIN), getAllActivities); // All activities

export default router;
