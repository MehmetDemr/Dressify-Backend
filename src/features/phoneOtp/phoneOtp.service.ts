import { PhoneOtp } from "./phoneOtp.model";
import { SendPhoneOtpDto } from "./dto/send-phoneOtp.dto";
import { VerifyPhoneOtpDto } from "./dto/verify-phoneOtp.dto";
import { AppError } from "../../utils/appError";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";

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
    const elapsed = now.getTime() - existing.createdAt.getTime();

    if (elapsed < OTP_WINDOW_MS) {
      if (existing.attempts >= MAX_ATTEMPTS) {
        throw new AppError(
          "You can send a maximum of 3 requests within 3 minutes.",
          429,
        );
      }

      await existing.update({ attempts: existing.attempts + 1 });
    } else {
      await existing.destroy();
    }
  }

  await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verifications.create({ to: dto.phoneNumber, channel: "sms" });

  await PhoneOtp.create({
    phone: dto.phoneNumber,
    code: "twilio",
    expiresAt: new Date(now.getTime() + OTP_WINDOW_MS),
  });

  return { message: "OTP sent." };
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

  const resetToken = jwt.sign(
    { phone: dto.phoneNumber, purpose: "password_reset" },
    process.env.JWT_SECRET!,
    { expiresIn: "3m" },
  );

  await record.destroy();
  return { message: "Phone number verified.", resetToken };
};

export const verifyOtpForPhoneChangeService = async (
  dto: VerifyPhoneOtpDto,
) => {
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

  const phoneChangeToken = jwt.sign(
    { currentPhone: dto.phoneNumber, purpose: "phone_change" },
    process.env.JWT_SECRET!,
    { expiresIn: "3m" },
  );

  return { message: "Phone number verified.", phoneChangeToken };
};

export const sendNewPhoneOtpService = async (
  phoneChangeToken: string,
  newPhone: string,
) => {
  // Verify token
  let payload: any;
  try {
    payload = jwt.verify(phoneChangeToken, process.env.JWT_SECRET!);
  } catch {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  if (payload.purpose !== "phone_change") {
    throw new AppError("Invalid token.", 403);
  }

  // New phone already in use?
  const existing = await User.findOne({ where: { phone: newPhone } });
  if (existing) {
    throw new AppError("This phone number is already in use.", 409);
  }

  // Send OTP to new phone via Twilio
  const now = new Date();

  await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verifications.create({ to: newPhone, channel: "sms" });

  await PhoneOtp.upsert({
    phone: newPhone,
    code: "twilio",
    expiresAt: new Date(now.getTime() + OTP_WINDOW_MS),
    attempts: 1,
  });

  return { message: "Verification code sent to new phone number." };
};

export const verifyNewPhoneService = async (
  phoneChangeToken: string,
  newPhone: string,
  verifyCode: string,
) => {
  // Verify token
  let payload: any;
  try {
    payload = jwt.verify(phoneChangeToken, process.env.JWT_SECRET!);
  } catch {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  if (payload.purpose !== "phone_change") {
    throw new AppError("Invalid token.", 403);
  }

  // Check OTP of new phone
  const now = new Date();
  const record = await PhoneOtp.findOne({ where: { phone: newPhone } });

  if (!record || record.expiresAt < now) {
    if (record) await record.destroy();
    throw new AppError("The OTP has expired or is invalid.", 400);
  }

  const check = await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: newPhone,
      code: verifyCode,
    });

  if (check.status !== "approved") {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();

  // Update phone
  const user = await User.findOne({ where: { phone: payload.currentPhone } });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await user.update({ phone: newPhone });

  return { message: "Phone number updated successfully." };
};

//null number case

export const sendOtpForAddPhoneService = async (
  userId: string,
  newPhone: string,
) => {
  const existing = await User.findOne({ where: { phone: newPhone } });
  if (existing) {
    throw new AppError("This phone number is already in use.", 409);
  }

  const now = new Date();

  await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verifications.create({ to: newPhone, channel: "sms" });

  await PhoneOtp.upsert({
    phone: newPhone,
    code: "twilio",
    expiresAt: new Date(now.getTime() + OTP_WINDOW_MS),
    attempts: 1,
  });

  return { message: "Verification code sent." };
};

export const verifyOtpForAddPhoneService = async (
  userId: string,
  newPhone: string,
  verifyCode: string,
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError("User not found.", 404);

  if (user.phone) {
    throw new AppError("User already has a phone number.", 400);
  }

  const now = new Date();
  const record = await PhoneOtp.findOne({ where: { phone: newPhone } });

  if (!record || record.expiresAt < now) {
    if (record) await record.destroy();
    throw new AppError("The OTP has expired or is invalid.", 400);
  }

  const check = await client.verify.v2
    .services(VERIFY_SERVICE_SID)
    .verificationChecks.create({ to: newPhone, code: verifyCode });

  if (check.status !== "approved") {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();
  await user.update({ phone: newPhone });

  return { message: "Phone number added successfully." };
};
