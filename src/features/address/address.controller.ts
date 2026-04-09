import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  getAddressesService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
} from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const getAddresses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await getAddressesService(user_id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const item = await getAddressByIdService(req.params.id as string, user_id);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(CreateAddressDto, req.body);
    await validateDto(dto);
    const item = await createAddressService(user_id, dto);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const dto = plainToInstance(UpdateAddressDto, req.body);
    await validateDto(dto);
    const item = await updateAddressService(req.params.id as string, user_id, dto);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id as string;
    const result = await deleteAddressService(req.params.id as string, user_id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
