import { GmailOtp } from "./gmailOtp.model";
import { SendGmailOtpDto } from "./dto/send-gmailOtp.dto";
import { VerifyGmailOtpDto } from "./dto/verify-gmailOtp.dto";
import { AppError } from "../../utils/appError";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER!,
  port: Number(process.env.SMTP_PORT!),
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME!,
    pass: process.env.SMTP_PASSWORD!,
  },
});

const OTP_WINDOW_MS = 3 * 60 * 1000;
const MAX_ATTEMPTS = 3;

const generateCode = () => crypto.randomInt(100000, 999999).toString();

export const sendGmailOtpService = async (dto: SendGmailOtpDto) => {
  const now = new Date();

  const existing = await GmailOtp.findOne({
    where: { email: dto.email },
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
      const newCode = generateCode();
      await existing.update({
        code: newCode,
        attempts: existing.attempts + 1,
      });

      await sendMail(dto.email, newCode);
      return { message: "OTP has been sent." };
    }

    await existing.destroy();
  }

  const code = generateCode();
  await GmailOtp.create({
    email: dto.email,
    code,
    expiresAt: new Date(now.getTime() + OTP_WINDOW_MS),
  });

  await sendMail(dto.email, code);
  return { message: "OTP has been sent." };
};

export const verifyGmailOtpService = async (dto: VerifyGmailOtpDto) => {
  const now = new Date();

  const record = await GmailOtp.findOne({
    where: { email: dto.email },
  });

  if (!record || record.expiresAt < now) {
    if (record) await record.destroy();
    throw new AppError("The OTP has expired or is invalid.", 400);
  }

  if (record.code !== dto.code) {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();
  return { message: "Email address verified." };
};

const sendMail = async (to: string, code: string) => {
  const result = await transporter.sendMail({
    from: `"Dressify" <${process.env.SMTP_FROM}>`,
    to,
    subject: "Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2>Your Verification Code</h2>
        <p>You can complete the process using the following code:</p>
        <h1 style="letter-spacing: 8px; color: #333;">${code}</h1>
        <p style="color: #999; font-size: 12px;">This code is valid for 3 minutes.</p>
      </div>
    `,
  });
  console.log("Mail result:", result);
};
