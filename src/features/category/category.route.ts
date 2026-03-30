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

router.get("/", getAllCategories); // Public
router.get("/:id", getCategoryById); // Public
router.get("/brand/:brandId", getCategoriesByBrand); // Public
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHEANT),
  createCategory,
); // Admin & Merchant
router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHEANT),
  updateCategory,
); // Admin & Merchant
router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHEANT),
  deleteCategory,
); // Admin & Merchant

export default router;
