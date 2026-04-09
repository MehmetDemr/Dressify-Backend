import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { getPermission, updatePermission } from "./permission.controller";

const router = Router();

router.get("/", authenticate, getPermission);
router.patch("/", authenticate, updatePermission);

export default router;
