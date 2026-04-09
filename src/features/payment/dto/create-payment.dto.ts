import { IsNotEmpty, IsString } from "class-validator";

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  cardName!: string;

  @IsString()
  @IsNotEmpty()
  cardNumber!: string;

  @IsString()
  @IsNotEmpty()
  cardExpireDate!: string;

  @IsString()
  @IsNotEmpty()
  cardCVV!: string;
}
