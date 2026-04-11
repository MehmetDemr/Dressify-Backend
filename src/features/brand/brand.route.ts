import { Router } from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "./brand.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.model";

const router = Router();

router.get("/", getAllBrands); // Public
router.get("/:id", getBrandById); // Public
router.post(
  "/",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  createBrand,
);
router.patch(
  "/:id",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  updateBrand,
);
router.delete(
  "/:id",
  authenticate as any,
  authorize(Role.ADMIN, Role.MERCHANT) as any,
  deleteBrand,
);

export default router;
