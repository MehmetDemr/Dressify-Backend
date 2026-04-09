import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  addressName!: string;

  @IsString()
  @IsNotEmpty()
  apartment!: string;

  @IsString()
  @IsNotEmpty()
  floor!: string;

  @IsString()
  @IsNotEmpty()
  flat!: string;

  @IsString()
  @IsNotEmpty()
  neighbour!: string;

  @IsString()
  @IsNotEmpty()
  province!: string;
  
  @IsString()
  @IsNotEmpty()
  district!: string;
}
