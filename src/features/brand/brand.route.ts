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
  authenticate,
  authorize(Role.ADMIN, Role.MERCHEANT),
  createBrand,
);
router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHEANT),
  updateBrand,
);
router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.MERCHEANT),
  deleteBrand,
);

export default router;
