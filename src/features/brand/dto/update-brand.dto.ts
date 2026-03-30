import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Brand name must be at least 3 characters." })
  @MaxLength(25, { message: "Brand name must be at most 25 characters." })
  brandName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Brand slug must be at least 3 characters." })
  @MaxLength(25, { message: "Brand slug must be at most 25 characters." })
  brandSlug?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
