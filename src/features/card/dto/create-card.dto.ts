import { IsUUID, IsNotEmpty } from "class-validator";

export class CreateCardDto {
  @IsUUID()
  @IsNotEmpty()
  product_id!: string;
}
