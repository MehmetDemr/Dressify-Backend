import { IsEmail, IsNotEmpty, IsJWT, Length } from "class-validator";

export class VerifyNewEmailOtpDto {
  @IsNotEmpty()
  @IsJWT()
  emailChangeToken!: string;

  @IsEmail({}, { message: "Please enter a valid email address." })
  @IsNotEmpty()
  newEmail!: string;

  @IsNotEmpty()
  @Length(6, 6, { message: "Verification code must be 6 digits." })
  verifyCode!: string;
}
