import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateFavouriteDto } from "./dto/create-favourite.dto";
import {
  addFavouriteService,
  getUserFavouritesService,
  removeFavouriteService,
  clearFavouritesService,
} from "./favourite.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const addFavourite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(CreateFavouriteDto, req.body);
    await validateDto(dto);
    const favourite = await addFavouriteService(req.user!.id, dto);
    res.status(201).json({ success: true, data: favourite });
  } catch (error) {
    next(error);
  }
};

export const getUserFavourites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const result = await getUserFavouritesService(req.user!.id, page, limit);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavourite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await removeFavouriteService(req.user!.id, req.params.id as string);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const clearFavourites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await clearFavouritesService(req.user!.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
