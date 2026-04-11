import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { SendGmailOtpDto } from "./dto/send-gmailOtp.dto";
import { VerifyGmailOtpDto } from "./dto/verify-gmailOtp.dto";
import { sendGmailOtpService, verifyGmailOtpService } from "./gmailOtp.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const sendGmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(SendGmailOtpDto, req.body);
    await validateDto(dto);
    const result = await sendGmailOtpService(dto);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const verifyGmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(VerifyGmailOtpDto, req.body);
    await validateDto(dto);
    const result = await verifyGmailOtpService(dto as any);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
