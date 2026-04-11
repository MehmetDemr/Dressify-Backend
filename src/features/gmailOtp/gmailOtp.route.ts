import { Router } from "express";

import { verifyGmailOtp, sendGmailOtp } from "./gmailOtp.controller";

const router = Router();

router.post("/verify", verifyGmailOtp as any);
router.post("/send", sendGmailOtp as any);

export default router;
