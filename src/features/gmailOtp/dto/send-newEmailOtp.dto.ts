import { IsEmail, IsNotEmpty, IsJWT } from "class-validator";

export class SendNewEmailOtpDto {
  @IsNotEmpty()
  @IsJWT()
  emailChangeToken!: string;

  @IsEmail({}, { message: "Please enter a valid email address." })
  @IsNotEmpty()
  newEmail!: string;
}
