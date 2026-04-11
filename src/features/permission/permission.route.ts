import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { getPermission, updatePermission } from "./permission.controller";

const router = Router();

router.get("/", authenticate as any, getPermission as any);
router.patch("/", authenticate as any, updatePermission as any);

export default router;
