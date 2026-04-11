import { IsString, IsNotEmpty } from "class-validator";

export class VerifyPhoneOtpDto {
  @IsNotEmpty()
  @IsString()
  declare phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  declare verifyCode: string;
}
