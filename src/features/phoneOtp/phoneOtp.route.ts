import { Router } from "express";

import { verifyOtp,sendOtp } from "./phoneOtp.controller";

const router = Router();

router.post("/verify", verifyOtp as any);
router.post("/send", sendOtp as any);

export default router;
