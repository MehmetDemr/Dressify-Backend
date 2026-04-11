import { IsEmail, IsString } from "class-validator";

export class SendGmailOtpDto {
  @IsString()
  @IsEmail()
  declare email: string;
}
