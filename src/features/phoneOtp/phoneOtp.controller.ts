import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { SendPhoneOtpDto } from "./dto/send-phoneOtp.dto";
import { VerifyPhoneOtpDto } from "./dto/verify-phoneOtp.dto";
import { sendOtpService, verifyOtpService } from "./phoneOtp.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(SendPhoneOtpDto, req.body);
    await validateDto(dto);
    const result = await sendOtpService(dto);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(VerifyPhoneOtpDto, req.body);
    await validateDto(dto);
    const result = await verifyOtpService(dto);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
