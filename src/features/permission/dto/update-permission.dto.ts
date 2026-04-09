import { IsBoolean, IsOptional } from "class-validator";

export class UpdatePermissionDto {
  @IsBoolean()
  @IsOptional()
  emailNotifyForNewProduct?: boolean;

  @IsBoolean()
  @IsOptional()
  emailNotifyForDiscount?: boolean;

  @IsBoolean()
  @IsOptional()
  smsNotifyForNewProduct?: boolean;

  @IsBoolean()
  @IsOptional()
  smsNotifyForDiscount?: boolean;

  @IsBoolean()
  @IsOptional()
  smsTwoFA?: boolean;

  @IsBoolean()
  @IsOptional()
  emailToFA?: boolean;

  @IsBoolean()
  @IsOptional()
  newLoginWarning?: boolean;
}
