import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getPermissionByUserService,
  updatePermissionService,
} from "./permission.service";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const getPermission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await getPermissionByUserService(user_id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(UpdatePermissionDto, req.body);
    await validateDto(dto);
    const item = await updatePermissionService(user_id, dto);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};
