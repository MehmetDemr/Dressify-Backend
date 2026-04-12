import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { SendGmailOtpDto } from "./dto/send-gmailOtp.dto";
import { VerifyGmailOtpDto } from "./dto/verify-gmailOtp.dto";
import {
  sendGmailOtpService,
  sendNewEmailOtpService,
  verifyGmailOtpNewEmailService,
  verifyGmailOtpService,
  verifyNewEmailService,
} from "./gmailOtp.service";
import { VerifyNewEmailOtpDto } from "./dto/verify-newEmailOtp.dto";
import { SendNewEmailOtpDto } from "./dto/send-newEmailOtp.dto";

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

//Verify controller for changing new email
export const verifyGmailOtpNewEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(VerifyGmailOtpDto, req.body);
    await validateDto(dto);
    const result = await verifyGmailOtpNewEmailService(dto as any);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const sendNewEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(SendNewEmailOtpDto, req.body);
    await validateDto(dto);
    const result = await sendNewEmailOtpService(
      dto.emailChangeToken,
      dto.newEmail,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const verifyNewEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(VerifyNewEmailOtpDto, req.body);
    await validateDto(dto);
    const result = await verifyNewEmailService(
      dto.emailChangeToken,
      dto.newEmail,
      dto.verifyCode,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
