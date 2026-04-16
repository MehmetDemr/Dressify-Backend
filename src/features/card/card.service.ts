import { Card } from "./card.model";
import { Product } from "../product/product.model";
import { Category } from "../category/category.model";
import { Brand } from "../brand/brand.model";
import { AppError } from "../../utils/appError";
import { CardResponseDto } from "./dto/card-response.dto";
import { CreateCardDto } from "./dto/create-card.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { updateActivityService } from "../userActivity/userActivity.service";
import {
  ActivityTypes,
  UserActivity,
} from "../userActivity/userActivity.model";

const cardInclude = [
  {
    model: Product,
    as: "product",
    attributes: [
      "id",
      "productName",
      "productSlug",
      "price",
      "stock",
      "imageUrl",
      "description",
    ],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "categoryName", "categorySlug"],
        include: [
          {
            model: Brand,
            as: "brand",
            attributes: ["id", "brandName", "brandSlug"],
          },
        ],
      },
    ],
  },
];

export const getCardService = async (user_id: string) => {
  const items = await Card.findAll({
    where: { user_id, active: true },
    include: cardInclude,
    order: [["createdAt", "DESC"]],
  });

  const data = items.map((item) => new CardResponseDto(item));

  const total = data.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  return { data, meta: { itemCount: data.length, total } };
};

export const addToCardService = async (user_id: string, dto: CreateCardDto) => {
  const existing = await Card.findOne({
    where: { user_id, product_id: dto.product_id, active: true },
  });

  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return new CardResponseDto(existing);
  }

  const item = await Card.create({
    user_id,
    product_id: dto.product_id,
    quantity: 1,
    active: true,
  } as any);

  // Activity tracking
  try {
    const product = await Product.findByPk(dto.product_id, {
      include: [{ model: Category, attributes: ["id", "brand_id"] }],
    });

    await updateActivityService(user_id, {
      product_id: dto.product_id,
      brand_id: product?.category?.brand_id ?? null,
      category_id: product?.category_id ?? null,
      activityType: ActivityTypes.SHOPPING,
    });
  } catch (err) {
    console.error("Activity tracking failed:", err);
  }

  return new CardResponseDto(item);
};

export const updateCardQuantityService = async (
  id: string,
  user_id: string,
  dto: UpdateCardDto,
) => {
  const item = await Card.findOne({ where: { id, user_id, active: true } });
  if (!item) throw new AppError("Cart item not found.", 404);

  await item.update({ quantity: dto.quantity });
  return new CardResponseDto(item);
};

export const removeFromCardService = async (id: string, user_id: string) => {
  const item = await Card.findOne({ where: { id, user_id } });
  if (!item) throw new AppError("Cart item not found.", 404);

  await item.destroy();

  // Activity tracking
  try {
    const activity = await UserActivity.findOne({
      where: {
        user_id,
        product_id: item.product_id,
        activityType: ActivityTypes.SHOPPING,
        active: true,
      },
    });

    if (activity) await activity.destroy(); 
  } catch (err) {
    console.error("Activity tracking failed:", err);
  }

  return { message: "Item removed from cart successfully." };
};
