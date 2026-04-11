import { NextFunction, Request, Response } from "express";
import {
  registerService,
  loginService,
  getMeService,
  deleteUserService,
} from "./user.service";
import { AppError } from "../../utils/appError";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import passport from "./google.strategy";
import jwt from "jsonwebtoken";
import applePassport from "./apple.strategy";

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

export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const result = await deleteUserService(userId);

    res.status(204).json({
      success: true,
      message: "User deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuthController = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleCallbackController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: Error, user: any) => {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: err?.message ?? "Google authentication failed.",
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as any },
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`,
      );
    },
  )(req, res, next);
};


export const appleAuthController = applePassport.authenticate("apple", {
  session: false,
});

export const appleCallbackController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
applePassport.authenticate(
  "apple",
  { session: false },
  (err: Error, user: any) => {
    console.log("Apple callback error:", err); 
    console.log("Apple callback user:", user); 

    if (err || !user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=apple_failed`,
      );
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as any },
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/apple/callback?token=${token}`,
    );
  },
)(req, res, next);
};
