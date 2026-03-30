import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  getCategoriesByBrandService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(CreateCategoryDto, req.body);
    await validateDto(dto);
    const category = await createCategoryService(dto);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await getCategoryByIdService(req.params.id as string);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesByBrand = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getCategoriesByBrandService(req.params.brandId as string);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(UpdateCategoryDto, req.body);
    await validateDto(dto);
    const category = await updateCategoryService(req.params.id as string, dto);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteCategoryService(req.params.id as string);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
