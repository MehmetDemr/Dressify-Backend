import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserGender } from "../user.model";

export class ChangePersonalInfoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters." })
  @MaxLength(25, { message: "Username must be at most 25 characters." })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers and underscore.",
  })
  newUserName!: string;

  @IsEnum(UserGender, { message: "Invalid gender value." })
  newGender!: UserGender;
}
