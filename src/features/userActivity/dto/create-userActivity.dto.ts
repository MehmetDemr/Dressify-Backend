import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { ActivityTypes } from "../userActivity.model";

export class CreateUserActivityDto {
  @IsNotEmpty()
  @IsUUID()
  brand_id!: string;

  @IsNotEmpty()
  @IsUUID()
  category_id!: string;

  @IsNotEmpty()
  @IsUUID()
  product_id!: string;

  @IsNotEmpty()
  @IsEnum(ActivityTypes, { message: "Invalid activity type." })
  activityType!: ActivityTypes;
}
