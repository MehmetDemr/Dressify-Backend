import { Router } from "express";
import {
  addFavourite,
  getUserFavourites,
  removeFavourite,
  clearFavourites,
} from "./favourite.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate as any);

router.get("/", getUserFavourites as any);
router.post("/", addFavourite as any);
router.delete("/clear", clearFavourites as any);
router.delete("/:id", removeFavourite as any);

export default router;
