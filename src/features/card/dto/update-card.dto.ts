import { IsInt, Min } from "class-validator";

export class UpdateCardDto {
  @IsInt()
  @Min(1)
  quantity!: number;
}
