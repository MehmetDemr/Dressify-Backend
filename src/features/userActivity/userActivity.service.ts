import { UserActivity } from "./userActivity.model";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { Product } from "../product/product.model";
import { CreateUserActivityDto } from "./dto/create-userActivity.dto";
import { UserActivityResponseDto } from "./dto/userActivity-response.dto";
import { AppError } from "../../utils/appError";

export const createActivityService = async (
  userId: string,
  dto: CreateUserActivityDto,
) => {
  const activity = await UserActivity.create({
    user_id: userId,
    product_id: dto.product_id,
    brand_id: dto.brand_id || null,
    category_id: dto.category_id || null,
    activityType: dto.activityType,
    active: true,
    count: 1,
  });

  return new UserActivityResponseDto(activity);
};

export const getUserActivitiesService = async (userId: string) => {
  const activities = await UserActivity.findAll({
    where: { user_id: userId, active: true },
    include: [
      { model: Brand, attributes: ["id", "brandName"] },
      { model: Category, attributes: ["id", "categoryName"] },
      {
        model: Product,
        attributes: ["id", "productName", "price", "imageUrl"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return activities.map((a) => new UserActivityResponseDto(a));
};

export const getActivityByIdService = async (
  userId: string,
  activityId: string,
) => {
  const activity = await UserActivity.findOne({
    where: { id: activityId, user_id: userId },
    include: [
      { model: Brand, attributes: ["id", "brandName"] },
      { model: Category, attributes: ["id", "categoryName"] },
      {
        model: Product,
        attributes: ["id", "productName", "price", "imageUrl"],
      },
    ],
  });
  if (!activity) throw new AppError("Activity not found.", 404);
  return new UserActivityResponseDto(activity);
};

// Admin get all activities
export const getAllActivitiesService = async () => {
  const activities = await UserActivity.findAll({
    where: { active: true },
    include: [
      { model: Brand, attributes: ["id", "brandName"] },
      { model: Category, attributes: ["id", "categoryName"] },
      {
        model: Product,
        attributes: ["id", "productName", "price", "imageUrl"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return activities.map((a) => new UserActivityResponseDto(a));
};

export const deleteActivityService = async (
  userId: string,
  activityId: string,
) => {
  const activity = await UserActivity.findOne({
    where: { id: activityId, user_id: userId },
  });
  if (!activity) throw new AppError("Activity not found.", 404);

  await activity.destroy();
  return { message: "Activity removed." };
};

export const updateActivityService = async (
  userId: string,
  dto: CreateUserActivityDto,
) => {
  if (!dto.product_id) throw new AppError("Product id is required.", 400);

  const product = await Product.findByPk(dto.product_id);
  if (!product) throw new AppError("Product not found.", 404);

  const existing = await UserActivity.findOne({
    where: {
      user_id: userId,
      product_id: dto.product_id,
      activityType: dto.activityType,
      active: true,
    },
  });

  if (existing) {
    await existing.update({ count: existing.count + 1 });
    return new UserActivityResponseDto(existing);
  }

  const activity = await UserActivity.create({
    user_id: userId,
    product_id: dto.product_id || null,
    brand_id: dto.brand_id || null,
    category_id: dto.category_id || null,
    activityType: dto.activityType,
    active: true,
    count: 1,
  });

  return new UserActivityResponseDto(activity);
};
