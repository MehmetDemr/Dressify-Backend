import { IsString, IsNotEmpty } from "class-validator";

export class SendPhoneOtpDto {
  @IsNotEmpty()
  @IsString()
  declare phoneNumber: string;
}
