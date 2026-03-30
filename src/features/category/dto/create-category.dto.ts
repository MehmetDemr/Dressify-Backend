import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  brand_id!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Category name must be at least 3 characters." })
  @MaxLength(25, { message: "Category name must be at most 25 characters." })
  categoryName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Category slug must be at least 3 characters." })
  @MaxLength(25, { message: "Category slug must be at most 25 characters." })
  categorySlug!: string;
}
