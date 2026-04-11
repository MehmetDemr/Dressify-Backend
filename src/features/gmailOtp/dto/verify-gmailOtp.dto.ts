import { IsEmail, IsString } from "class-validator";

export class VerifyGmailOtpDto {
  @IsString()
  @IsEmail()
  declare email: string;

  @IsString()
  declare code: string;
}
