import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Brand name must be at least 3 characters." })
  @MaxLength(25, { message: "Brand name must be at most 25 characters." })
  brandName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Brand slug must be at least 3 characters." })
  @MaxLength(25, { message: "Brand slug must be at most 25 characters." })
  brandSlug!: string;
}
