import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.model";

const router = Router();

router.get("/", authenticate as any, getAllProducts as any); // Public
router.get("/:id", authenticate as any, getProductById as any); // Public
router.get(
  "/category/:categoryId",
  authenticate as any,
  getProductsByCategory as any,
); // Public
router.post(
  "/",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  createProduct as any,
); // Admin & Merchant
router.patch(
  "/:id",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  updateProduct as any,
); // Admin & Merchant
router.delete(
  "/:id",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  deleteProduct as any,
); // Admin & Merchant

export default router;
