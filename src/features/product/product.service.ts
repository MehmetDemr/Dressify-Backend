import { Product } from "./product.model";
import { Category } from "../category/category.model";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { AppError } from "../../utils/appError";
import { Favourite } from "../favourite/favourite.model";
import { Brand } from "../brand/brand.model";

export const createProductService = async (dto: CreateProductDto) => {
  const category = await Category.findByPk(dto.category_id);
  if (!category) throw new AppError("Category not found.", 404);

  const existing = await Product.findOne({
    where: { productSlug: dto.productSlug },
  });
  if (existing) throw new AppError("This product slug is already taken.", 409);

  const product = await Product.create({ ...(dto as any), active: true });
  return new ProductResponseDto(product);
};

export const getAllProductsService = async (
  userId?: string,
  page: number = 1,
  limit: number = 24,
  brandSlug?: string,
  categorySlug?: string, 
) => {
  const offset = (page - 1) * limit;

  const { count, rows: products } = await Product.findAndCountAll({
    where: { active: true },
    limit,
    offset,
    distinct: true,
    subQuery: false,
    include: [
      {
        model: Category,
        attributes: ["id", "categoryName", "categorySlug", "brand_id"],
        required: !!brandSlug || !!categorySlug,
        where: categorySlug ? { categorySlug } : undefined, 
        include: [
          {
            model: Brand,
            attributes: ["id", "brandName", "brandSlug"],
            where: brandSlug ? { brandSlug, active: true } : undefined,
            required: !!brandSlug,
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  let favouriteIds = new Set<string>();

  if (userId) {
    const favourites = await Favourite.findAll({
      where: { user_id: userId, active: true },
      attributes: ["product_id"],
    });

    favouriteIds = new Set(favourites.map((f) => String(f.product_id)));
  }

  const data = products.map((p) => {
    const dto = new ProductResponseDto(p);

    return {
      ...dto,
      isFavourite: favouriteIds.has(String(p.id)),
    };
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    limit: Number(limit),
    data,
  };
};

export const getProductByIdService = async (id: string, userId?: string) => {
  const product = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        attributes: ["id", "categoryName", "categorySlug", "brand_id"],
        include: [
          {
            model: Brand,
            attributes: ["id", "brandName", "brandSlug"],
          },
        ],
      },
    ],
  });

  if (!product) throw new AppError("Product not found.", 404);

  let isFavourite = false;

  if (userId) {
    const favourite = await Favourite.findOne({
      where: {
        user_id: userId,
        product_id: id,
        active: true,
      },
    });

    isFavourite = !!favourite;
  }

  const dto = new ProductResponseDto(product);

  return {
    ...dto,
    isFavourite,
  };
};

export const getProductsByCategoryService = async (
  categoryId: string,
  userId?: string,
  page: number = 1,
  limit: number = 24,
) => {
  const category = await Category.findByPk(categoryId);
  if (!category) throw new AppError("Category not found.", 404);

  const offset = (page - 1) * limit;

  const { count, rows: products } = await Product.findAndCountAll({
    where: { category_id: categoryId, active: true },
    limit: limit,
    offset: offset,
    distinct: true,
    include: [
      {
        model: Category,
        attributes: ["id", "categoryName", "categorySlug", "brand_id"],
        include: [
          {
            model: Brand,
            attributes: ["id", "brandName", "brandSlug"],
          },
        ],
      },
    ],
  });

  let favouriteIds = new Set<string>();

  if (userId) {
    const favourites = await Favourite.findAll({
      where: { user_id: userId, active: true },
      attributes: ["product_id"],
    });
    favouriteIds = new Set(favourites.map((f) => String(f.product_id)));
  }

  const data = products.map((p) => {
    const dto = new ProductResponseDto(p);
    return {
      ...dto,
      isFavourite: favouriteIds.has(String(p.id)),
    };
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    limit: Number(limit),
    data,
  };
};

export const updateProductService = async (
  id: string,
  dto: UpdateProductDto,
) => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found.", 404);

  if (dto.category_id) {
    const category = await Category.findByPk(dto.category_id);
    if (!category) throw new AppError("Category not found.", 404);
  }

  if (dto.productSlug && dto.productSlug !== product.productSlug) {
    const existing = await Product.findOne({
      where: { productSlug: dto.productSlug },
    });
    if (existing)
      throw new AppError("This product slug is already taken.", 409);
  }

  await product.update(dto);
  return new ProductResponseDto(product);
};

export const deleteProductService = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new AppError("Product not found.", 404);

  await product.update({ active: false });
  return { message: "Product deleted successfully." };
};
