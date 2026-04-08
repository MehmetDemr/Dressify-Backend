import { Router } from "express";
import {
  getCard,
  addToCard,
  updateCardQuantity,
  removeFromCard,
} from "./card.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getCard);
router.post("/", authenticate, addToCard);
router.patch("/:id", authenticate, updateCardQuantity);
router.delete("/:id", authenticate, removeFromCard);

export default router;
