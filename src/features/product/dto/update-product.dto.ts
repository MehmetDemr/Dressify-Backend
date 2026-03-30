import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Product name must be at least 3 characters." })
  @MaxLength(30, { message: "Product name must be at most 30 characters." })
  productName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Product slug must be at least 3 characters." })
  @MaxLength(30, { message: "Product slug must be at most 30 characters." })
  productSlug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Price cannot be negative." })
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Stock cannot be negative." })
  stock?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
