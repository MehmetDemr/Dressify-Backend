import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ActivityTypes } from "../userActivity.model";

export class CreateUserActivityDto {
  @IsOptional()
  @IsUUID()
  brand_id?: string | null;

  @IsOptional()
  @IsUUID()
  category_id?: string | null;

  @IsOptional()
  @IsUUID()
  product_id?: string | null;

  @IsNotEmpty()
  @IsEnum(ActivityTypes, { message: "Invalid activity type." })
  activityType!: ActivityTypes;
}
