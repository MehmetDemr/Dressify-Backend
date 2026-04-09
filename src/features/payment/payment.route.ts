import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "./payment.controller";

const router = Router();

router.get("/", authenticate, getPayments);
router.get("/:id", authenticate, getPaymentById);
router.post("/", authenticate, createPayment);
router.patch("/:id", authenticate, updatePayment);
router.delete("/:id", authenticate, deletePayment);

export default router;
