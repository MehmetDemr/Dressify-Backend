import { Router } from "express";
import {
  getCard,
  addToCard,
  updateCardQuantity,
  removeFromCard,
} from "./card.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate as any, getCard as any);
router.post("/", authenticate as any, addToCard as any);
router.patch("/:id", authenticate as any, updateCardQuantity as any);
router.delete("/:id", authenticate as any, removeFromCard as any);

export default router;
