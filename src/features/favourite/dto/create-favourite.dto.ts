import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateFavouriteDto {
  @IsNotEmpty()
  @IsUUID()
  product_id!: string;
}
