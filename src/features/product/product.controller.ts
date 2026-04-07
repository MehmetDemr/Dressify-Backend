import { Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  getProductsByCategoryService,
  updateProductService,
  deleteProductService,
} from "./product.service";

const validateDto = async (dto: object) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints || {}).join(", "))
      .join(" | ");
    throw new AppError(messages, 400);
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(CreateProductDto, req.body);
    await validateDto(dto);
    const product = await createProductService(dto);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const products = await getAllProductsService(userId);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const product = await getProductByIdService(
      req.params.id as string,
      userId,
    );
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const products = await getProductsByCategoryService(
      req.params.categoryId as string,
      userId,
    );
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = plainToInstance(UpdateProductDto, req.body);
    await validateDto(dto);
    const product = await updateProductService(req.params.id as string, dto);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await deleteProductService(req.params.id as string);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
