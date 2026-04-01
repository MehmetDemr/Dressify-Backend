import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateUserActivityDto } from "./dto/create-userActivity.dto";
import {
  createActivityService,
  getUserActivitiesService,
  getActivityByIdService,
  getAllActivitiesService,
  deleteActivityService,
} from "./userActivity.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const createActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(CreateUserActivityDto, req.body);
    await validateDto(dto);
    const activity = await createActivityService(req.user!.id, dto);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

export const getUserActivities = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activities = await getUserActivitiesService(req.user!.id);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

export const getActivityById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activity = await getActivityByIdService(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

export const getAllActivities = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activities = await getAllActivitiesService();
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteActivityService(
      req.user!.id,
      req.params.id as string,
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
