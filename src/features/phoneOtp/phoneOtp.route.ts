import { Router } from "express";

import {
  verifyOtp,
  sendOtp,
  verifyOtpForPhoneChange,
  sendNewPhoneOtp,
  verifyNewPhoneOtp,
  sendOtpForAddPhone,
  verifyOtpForAddPhone,
} from "./phoneOtp.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/verify", verifyOtp as any);
router.post("/send", sendOtp as any);

router.post(
  "/profile-verify",
  authenticate as any,
  verifyOtpForPhoneChange as any,
);
router.post("/send-new-phone", authenticate as any, sendNewPhoneOtp as any);
router.post("/verify-new-phone", authenticate as any, verifyNewPhoneOtp as any);

router.post(
  "/send/send-otp-add",
  authenticate as any,
  sendOtpForAddPhone as any,
);

router.post(
  "/verify/verify-otp-add",
  authenticate as any,
  verifyOtpForAddPhone as any,
);

export default router;
