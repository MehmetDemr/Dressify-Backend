import { UserActivity, ActivityTypes } from "../userActivity.model";

export class UserActivityResponseDto {
  id: string;
  user_id: string;
  brand_id: string | null;
  brand_name: string | null;
  category_id: string | null;
  category_name: string | null;
  product_id: string | null;
  product_name: string | null;
  product_price: number | null;
  product_imageUrl: string | null;
  activityType: ActivityTypes;
  count: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(activity: UserActivity) {
    this.id = activity.id;
    this.user_id = activity.user_id;
    this.brand_id = activity.brand_id;
    this.brand_name = activity.brand?.brandName ?? null;
    this.category_id = activity.category_id;
    this.category_name = activity.category?.categoryName ?? null;
    this.product_id = activity.product_id;
    this.product_name = activity.product?.productName ?? null;
    this.product_price = activity.product?.price ?? null;
    this.product_imageUrl = activity.product?.imageUrl ?? null;
    this.activityType = activity.activityType;
    this.count = activity.count;
    this.active = activity.active;
    this.createdAt = activity.createdAt;
    this.updatedAt = activity.updatedAt;
  }
}
