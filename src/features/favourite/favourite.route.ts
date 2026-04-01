import { Router } from "express";
import {
  addFavourite,
  getUserFavourites,
  removeFavourite,
  clearFavourites,
} from "./favourite.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getUserFavourites);
router.post("/", addFavourite);
router.delete("/clear", clearFavourites);
router.delete("/:id", removeFavourite);

export default router;
