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
  const brand = await Brand.findByPk(dto.brand_id);
  if (!brand) throw new AppError("Brand not found.", 404);

  const category = await Category.findByPk(dto.category_id);
  if (!category) throw new AppError("Category not found.", 404);

  const product = await Product.findByPk(dto.product_id);
  if (!product) throw new AppError("Product not found.", 404);

  const activity = await UserActivity.create({
    user_id: userId,
    ...dto,
    active: true,
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

  await activity.update({ active: false });
  return { message: "Activity deleted successfully." };
};
