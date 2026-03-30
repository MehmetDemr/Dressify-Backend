import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import {
  createBrandService,
  getAllBrandsService,
  getBrandByIdService,
  updateBrandService,
  deleteBrandService,
} from "./brand.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(CreateBrandDto, req.body);
    await validateDto(dto);
    const brand = await createBrandService(dto);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brands = await getAllBrandsService();
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brand = await getBrandByIdService(req.params.id as string);
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(UpdateBrandDto, req.body);
    await validateDto(dto);
    const brand = await updateBrandService(req.params.id as string, dto);
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteBrandService(req.params.id as string);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
