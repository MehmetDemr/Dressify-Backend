import { Favourite } from "./favourite.model";
import { Product } from "../product/product.model";
import { CreateFavouriteDto } from "./dto/create-favourite.dto";
import { FavouriteResponseDto } from "./dto/favourite-response.dto";
import { AppError } from "../../utils/appError";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { updateActivityService } from "../userActivity/userActivity.service";
import {
  ActivityTypes,
  UserActivity,
} from "../userActivity/userActivity.model";

export const addFavouriteService = async (
  userId: string,
  dto: CreateFavouriteDto,
) => {
  const product = await Product.findByPk(dto.product_id, {
    include: [{ model: Category, attributes: ["id", "brand_id"] }],
  });
  if (!product) throw new AppError("Product not found.", 404);
  if (!product) throw new AppError("Product not found.", 404);

  const existing = await Favourite.findOne({
    where: { user_id: userId, product_id: dto.product_id },
  });
  if (existing) throw new AppError("Product is already in favourites.", 409);

  const favourite = await Favourite.create({
    user_id: userId,
    product_id: dto.product_id,
    active: true,
  });

  try {
    await updateActivityService(userId, {
      product_id: dto.product_id,
      brand_id: product.category?.brand_id ?? null,
      category_id: product.category_id ?? null,
      activityType: ActivityTypes.ADDING_FAVOURITE,
    });
  } catch (err) {
    console.error("Activity tracking failed:", err);
  }

  return new FavouriteResponseDto(favourite);
};

export const getUserFavouritesService = async (
  userId: string,
  page: number = 1,
  limit: number = 24,
) => {
  const offset = (page - 1) * limit;

  const { count, rows: favourites } = await Favourite.findAndCountAll({
    where: { user_id: userId, active: true },
    limit: limit,
    offset: offset,
    distinct: true,
    include: [
      {
        model: Product,
        attributes: ["id", "productName", "price", "imageUrl"],
        include: [
          {
            model: Category,
            attributes: ["id", "categoryName"],
            include: [
              {
                model: Brand,
                attributes: ["id", "brandName"],
              },
            ],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  const data = favourites.map((f) => new FavouriteResponseDto(f));

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
    limit: Number(limit),
    data,
  };
};

export const removeFavouriteService = async (
  userId: string,
  favouriteId: string,
) => {
  const favourite = await Favourite.findOne({
    where: { id: favouriteId, user_id: userId },
    include: [
      {
        model: Product,
        attributes: ["id", "category_id"],
        include: [
          {
            model: Category,
            attributes: ["id", "brand_id"],
          },
        ],
      },
    ],
  });

  if (!favourite) throw new AppError("Favourite not found.", 404);

  await favourite.destroy();

  try {
    const activity = await UserActivity.findOne({
      where: {
        user_id: userId,
        product_id: favourite.product_id,
        activityType: ActivityTypes.ADDING_FAVOURITE,
        active: true,
      },
    });

    if (activity) await activity.destroy();
  } catch (err) {
    console.error("Activity tracking failed:", err);
  }

  return { message: "Product removed from favourites." };
};

export const clearFavouritesService = async (userId: string) => {
  try {
    await UserActivity.update(
      { active: false },
      {
        where: {
          user_id: userId,
          activityType: ActivityTypes.ADDING_FAVOURITE,
          active: true,
        },
      },
    );
  } catch (err) {
    console.error("Activity tracking failed:", err);
  }

  await Favourite.destroy({
    where: { user_id: userId },
  });

  return { message: "All favourites cleared." };
};
