import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getPaymentsService,
  getPaymentByIdService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
} from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const getPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await getPaymentsService(user_id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const item = await getPaymentByIdService(req.params.id as string, user_id);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(CreatePaymentDto, req.body);
    await validateDto(dto);
    const item = await createPaymentService(user_id, dto);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(UpdatePaymentDto, req.body);
    await validateDto(dto);
    const item = await updatePaymentService(
      req.params.id as string,
      user_id,
      dto,
    );
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deletePayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await deletePaymentService(req.params.id as string, user_id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
