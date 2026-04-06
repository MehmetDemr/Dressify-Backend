import { NextFunction, Request, Response } from "express";
import { registerService, loginService, getMeService } from "./user.service";

import { AppError } from "../../utils/appError";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UserResponseDto } from "./dto/user-response.dto";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(RegisterDto, req.body);
    await validateDto(dto);
    const user = await registerService(dto);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(LoginDto, req.body);
    await validateDto(dto);
    const result = await loginService(dto);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;

    const result = await getMeService(userId);

    res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
