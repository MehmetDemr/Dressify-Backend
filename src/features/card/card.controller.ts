import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getCardService,
  addToCardService,
  updateCardQuantityService,
  removeFromCardService,
} from "./card.service";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const getCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await getCardService(user_id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const addToCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(CreateCardDto, req.body);
    await validateDto(dto);
    const item = await addToCardService(user_id, dto as any);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateCardQuantity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(UpdateCardDto, req.body);
    await validateDto(dto);
    const item = await updateCardQuantityService(
      req.params.id as string,
      user_id,
      dto,
    );
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const removeFromCard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await removeFromCardService(
      req.params.id as string,
      user_id,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
