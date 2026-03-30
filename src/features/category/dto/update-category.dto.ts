import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsUUID()
  brand_id?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Category name must be at least 3 characters." })
  @MaxLength(25, { message: "Category name must be at most 25 characters." })
  categoryName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Category slug must be at least 3 characters." })
  @MaxLength(25, { message: "Category slug must be at most 25 characters." })
  categorySlug?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
