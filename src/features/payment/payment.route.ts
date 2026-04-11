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

router.get("/", authenticate as any, getPayments as any);
router.get("/:id", authenticate as any, getPaymentById as any);
router.post("/", authenticate as any, createPayment as any);
router.patch("/:id", authenticate as any, updatePayment as any);
router.delete("/:id", authenticate as any, deletePayment as any);

export default router;
