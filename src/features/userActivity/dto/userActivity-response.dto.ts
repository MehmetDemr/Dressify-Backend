import { UserActivity, ActivityTypes } from "../userActivity.model";

export class UserActivityResponseDto {
  id: string;
  user_id: string;
  brand_id: string;
  category_id: string;
  product_id: string;
  activityType: ActivityTypes;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(activity: UserActivity) {
    this.id = activity.id;
    this.user_id = activity.user_id;
    this.brand_id = activity.brand_id;
    this.category_id = activity.category_id;
    this.product_id = activity.product_id;
    this.activityType = activity.activityType;
    this.active = activity.active;
    this.createdAt = activity.createdAt;
    this.updatedAt = activity.updatedAt;
  }
}
