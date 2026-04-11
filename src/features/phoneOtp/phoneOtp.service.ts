import { PhoneOtp } from "./phoneOtp.model";
import { SendPhoneOtpDto } from "./dto/send-phoneOtp.dto";
import { VerifyPhoneOtpDto } from "./dto/verify-phoneOtp.dto";
import { AppError } from "../../utils/appError";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID!;
const OTP_WINDOW_MS = 3 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export const sendOtpService = async (dto: SendPhoneOtpDto) => {
  const now = new Date();

  const existing = await PhoneOtp.findOne({
    where: { phone: dto.phoneNumber },
  });

  if (existing) {
    const windowStart = new Date(existing.createdAt.getTime());
    const elapsed = now.getTime() - windowStart.getTime();

    if (elapsed < OTP_WINDOW_MS) {
      const attempts = parseInt(existing.code.split(":")[1] ?? "1");

      if (attempts >= MAX_ATTEMPTS) {
        throw new AppError(
          "You can send a maximum of 3 requests within 3 minutes.",
          429,
        );
      }

      await existing.update({
        code: existing.code.split(":")[0] + ":" + (attempts + 1),
      });
    } else {
      await existing.destroy();
    }
  }

  await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verifications.create({ to: dto.phoneNumber, channel: "sms" });

  await PhoneOtp.create({
    phone: dto.phoneNumber,
    code: "twilio:1",
    expiresAt: new Date(now.getTime() + OTP_WINDOW_MS),
  });

  return { message: "OTP send." };
};

export const verifyOtpService = async (dto: VerifyPhoneOtpDto) => {
  const now = new Date();

  const record = await PhoneOtp.findOne({
    where: { phone: dto.phoneNumber },
  });

  if (!record || record.expiresAt < now) {
    if (record) await record.destroy();
    throw new AppError("The OTP has expired or is invalid.", 400);
  }

  const check = await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: dto.phoneNumber,
      code: dto.verifyCode,
    });

  if (check.status !== "approved") {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();

  return { message: "Phone number verified." };
};
