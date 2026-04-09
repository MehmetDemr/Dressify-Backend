import { IsString, IsOptional } from "class-validator";

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  addressName?: string;

  @IsString()
  @IsOptional()
  apartment?: string;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsString()
  @IsOptional()
  flat?: string;

  @IsString()
  @IsOptional()
  neighbour?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  district?: string;
}
