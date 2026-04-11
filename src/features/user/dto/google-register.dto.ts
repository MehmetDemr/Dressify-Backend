import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class GoogleRegisterDto {
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

  @IsOptional()
  @IsString()
  phone?: string;
}
