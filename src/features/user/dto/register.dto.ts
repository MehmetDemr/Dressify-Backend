import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { UserGender } from "../user.model";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters." })
  @MaxLength(25, { message: "Username must be at most 25 characters." })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers and underscore.",
  })
  userName!: string;

  @IsEmail({}, { message: "Invalid email address." })
  email!: string;

  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message:
      "Password must contain at least 1 uppercase, 1 lowercase and 1 special character.",
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsEnum(UserGender, { message: "Invalid gender value." })
  gender!: UserGender;
}
