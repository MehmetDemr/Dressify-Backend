import { IsString, IsOptional } from "class-validator";

export class UpdatePaymentDto {
  @IsString()
  @IsOptional()
  cardName?: string;

  @IsString()
  @IsOptional()
  cardNumber?: string;

  @IsString()
  @IsOptional()
  cardExpireDate?: string;

  @IsString()
  @IsOptional()
  cardCVV?: string;
}
