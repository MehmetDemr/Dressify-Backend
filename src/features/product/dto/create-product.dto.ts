import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsUUID()
  category_id!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Product name must be at least 3 characters." })
  @MaxLength(30, { message: "Product name must be at most 30 characters." })
  productName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Product slug must be at least 3 characters." })
  @MaxLength(30, { message: "Product slug must be at most 30 characters." })
  productSlug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: "Price cannot be negative." })
  price!: number;

  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: "Stock cannot be negative." })
  stock!: number;
}
