import { Category } from "./category.model";
import { Brand } from "../brand/brand.model";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { AppError } from "../../utils/appError";

export const createCategoryService = async (dto: CreateCategoryDto) => {
  const brand = await Brand.findByPk(dto.brand_id);
  if (!brand) throw new AppError("Brand not found.", 404);

  const existing = await Category.findOne({
    where: { categorySlug: dto.categorySlug },
  });
  if (existing) throw new AppError("This category slug is already taken.", 409);

  const category = await Category.create({ ...(dto as any), active: true });
  return new CategoryResponseDto(category);
};

export const getAllCategoriesService = async () => {
  const categories = await Category.findAll({
    where: { active: true },
    include: [{ model: Brand, attributes: ["id", "brandName"] }],
  });
  return categories.map((c) => new CategoryResponseDto(c));
};

export const getCategoryByIdService = async (id: string) => {
  const category = await Category.findByPk(id, {
    include: [{ model: Brand, attributes: ["id", "brandName"] }],
  });
  if (!category) throw new AppError("Category not found.", 404);
  return new CategoryResponseDto(category);
};

export const getCategoriesByBrandService = async (brandId: string) => {
  const brand = await Brand.findByPk(brandId);
  if (!brand) throw new AppError("Brand not found.", 404);

  const categories = await Category.findAll({
    where: { brand_id: brandId, active: true },
  });
  return categories.map((c) => new CategoryResponseDto(c));
};

export const updateCategoryService = async (
  id: string,
  dto: UpdateCategoryDto,
) => {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError("Category not found.", 404);

  if (dto.brand_id) {
    const brand = await Brand.findByPk(dto.brand_id);
    if (!brand) throw new AppError("Brand not found.", 404);
  }

  if (dto.categorySlug && dto.categorySlug !== category.categorySlug) {
    const existing = await Category.findOne({
      where: { categorySlug: dto.categorySlug },
    });
    if (existing)
      throw new AppError("This category slug is already taken.", 409);
  }

  await category.update(dto);
  return new CategoryResponseDto(category);
};

export const deleteCategoryService = async (id: string) => {
  const category = await Category.findByPk(id);
  if (!category) throw new AppError("Category not found.", 404);

  await category.update({ active: false });
  return { message: "Category deleted successfully." };
};
