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

router.get("/", authenticate,getAllProducts); // Public
router.get("/:id", authenticate, getProductById); // Public
router.get("/category/:categoryId",authenticate, getProductsByCategory); // Public
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHANT),
  createProduct,
); // Admin & Merchant
router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHANT),
  updateProduct,
); // Admin & Merchant
router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHANT),
  deleteProduct,
); // Admin & Merchant

export default router;
