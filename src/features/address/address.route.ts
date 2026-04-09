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

router.get("/", authenticate, getAddresses);
router.get("/:id", authenticate, getAddressById);
router.post("/", authenticate, createAddress);
router.patch("/:id", authenticate, updateAddress);
router.delete("/:id", authenticate, deleteAddress);
    
export default router;
