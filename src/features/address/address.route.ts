import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "./address.controller";

const router = Router();

router.get("/", authenticate as any, getAddresses as any);
router.get("/:id", authenticate as any, getAddressById as any);
router.post("/", authenticate as any, createAddress as any);
router.patch("/:id", authenticate as any, updateAddress as any);
router.delete("/:id", authenticate as any, deleteAddress as any);
    
export default router;
