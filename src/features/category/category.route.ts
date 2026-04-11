import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoriesByBrand,
  updateCategory,
  deleteCategory,
} from "./category.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.model";

const router = Router();

router.get("/", getAllCategories as any); // Public
router.get("/:id", getCategoryById as any); // Public
router.get("/brand/:brandId", getCategoriesByBrand as any); // Public
router.post(
  "/",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  createCategory as any,
); // Admin & Merchant
router.patch(
  "/:id",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  updateCategory as any,
); // Admin & Merchant
router.delete(
  "/:id",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  deleteCategory as any,
); // Admin & Merchant

export default router;
