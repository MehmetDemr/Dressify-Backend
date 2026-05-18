import { Router } from "express";

import {
  verifyGmailOtp,
  sendGmailOtp,
  sendNewEmailOtp,
  verifyNewEmailOtp,
  verifyGmailOtpNewEmail,
  contactController,
} from "./gmailOtp.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/verify", verifyGmailOtp as any);
router.post("/send", sendGmailOtp as any);

router.post(
  "/profile-verify",
  authenticate as any,
  verifyGmailOtpNewEmail as any,
);
router.post("/send-new-email", authenticate as any, sendNewEmailOtp as any);
router.post("/verify-new-email", authenticate as any, verifyNewEmailOtp as any);
router.post("/contact", contactController);

export default router;
