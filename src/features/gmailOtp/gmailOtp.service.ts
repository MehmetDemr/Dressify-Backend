import { GmailOtp } from "./gmailOtp.model";
import { SendGmailOtpDto } from "./dto/send-gmailOtp.dto";
import { VerifyGmailOtpDto } from "./dto/verify-gmailOtp.dto";
import { AppError } from "../../utils/appError";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";

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

  if (record.code !== dto.verifyCode) {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();

  const resetToken = jwt.sign(
    { email: dto.email, purpose: "password_reset" },
    process.env.JWT_SECRET!,
    { expiresIn: "3m" },
  );

  return { message: "Email address verified.", resetToken };
};

export const verifyGmailOtpNewEmailService = async (dto: VerifyGmailOtpDto) => {
  const now = new Date();

  const record = await GmailOtp.findOne({
    where: { email: dto.email },
  });

  if (!record || record.expiresAt < now) {
    if (record) await record.destroy();
    throw new AppError("The OTP has expired or is invalid.", 400);
  }

  if (record.code !== dto.verifyCode) {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();

  const resetToken = jwt.sign(
    { email: dto.email, purpose: "email_change" },
    process.env.JWT_SECRET!,
    { expiresIn: "3m" },
  );

  return { message: "Email address verified.", resetToken };
};

//Change your email in profile page.

export const sendNewEmailOtpService = async (
  emailChangeToken: string,
  newEmail: string,
) => {
  //  Verify Token
  let payload: any;
  try {
    payload = jwt.verify(emailChangeToken, process.env.JWT_SECRET!);
  } catch {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  if (payload.purpose !== "email_change") {
    throw new AppError("Invalid token.", 403);
  }

  //  New email exists?
  const existing = await User.findOne({ where: { email: newEmail } });
  if (existing) {
    throw new AppError("This email is already in use.", 409);
  }

  // Send OTP to new Email
  const now = new Date();
  const code = generateCode();

  await GmailOtp.upsert({
    email: newEmail,
    code,
    expiresAt: new Date(now.getTime() + OTP_WINDOW_MS),
    attempts: 1,
  });

  await sendMail(newEmail, code);
  return { message: "Verification code sent to new email." };
};

export const verifyNewEmailService = async (
  emailChangeToken: string,
  newEmail: string,
  verifyCode: string,
) => {
  // Verify Token
  let payload: any;
  try {
    payload = jwt.verify(emailChangeToken, process.env.JWT_SECRET!);
  } catch {
    throw new AppError("Token is invalid or has expired.", 400);
  }

  if (payload.purpose !== "email_change") {
    throw new AppError("Invalid token.", 403);
  }

  // Check OTP of new email
  const now = new Date();
  const record = await GmailOtp.findOne({ where: { email: newEmail } });

  if (!record || record.expiresAt < now) {
    if (record) await record.destroy();
    throw new AppError("The OTP has expired or is invalid.", 400);
  }

  if (record.code !== verifyCode) {
    throw new AppError("The OTP code is incorrect.", 400);
  }

  await record.destroy();

  // Change Email
  const user = await User.findOne({ where: { email: payload.email } });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await user.update({ email: newEmail });

  return { message: "Email updated successfully." };
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

export const sendContactEmail = async (
  name: string,
  email: string,
  topic: string,
  message: string,
): Promise<{ message: string }> => {
  if (!name || !email || !topic || !message) {
    throw new AppError("All fields are required.", 400);
  }

  const topicLabels: Record<string, string> = {
    support: "Customer Support",
    partnership: "Brand Partnership",
    returns: "Returns & Delivery",
    general: "General Inquiry",
  };

  const topicLabel = topicLabels[topic] ?? topic;

  await transporter.sendMail({
    from: `"Dressify" <${process.env.SMTP_FROM}>`,
    to: process.env.SMTP_FROM,
    replyTo: `"${name}" <${email}>`,
    subject: `[Dressify Contact] ${topicLabel}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e3e8ee; border-radius: 8px;">
        <h2 style="color: #111111; margin-bottom: 4px;">New Contact Message</h2>
        <p style="color: #888; font-size: 13px; margin-top: 0;">From Dressify Contact Page</p>
        <hr style="border: none; border-top: 1px solid #e3e8ee; margin: 24px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #888; width: 120px;">Full Name</td>
            <td style="color: #111; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Email</td>
            <td style="color: #111; font-weight: 600;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888;">Topic</td>
            <td style="color: #111; font-weight: 600;">${topicLabel}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e3e8ee; margin: 24px 0;" />
        <p style="color: #888; font-size: 13px; margin-bottom: 8px;">Message</p>
        <p style="color: #111; line-height: 1.8; white-space: pre-wrap;">${message}</p>
        <hr style="border: none; border-top: 1px solid #e3e8ee; margin: 24px 0;" />
        <p style="color: #bbb; font-size: 11px;">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });

  return { message: "Your message has been sent successfully." };
};
