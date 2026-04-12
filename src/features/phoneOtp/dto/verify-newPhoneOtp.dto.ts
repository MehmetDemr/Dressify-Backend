import { IsNotEmpty, IsJWT, Matches, Length } from "class-validator";

export class VerifyNewPhoneOtpDto {
  @IsNotEmpty()
  @IsJWT()
  phoneChangeToken!: string;

  @IsNotEmpty()
  @Matches(/^\+90\d{10}$/, {
    message: "Phone must be in +90XXXXXXXXXX format.",
  })
  newPhone!: string;

  @IsNotEmpty()
  @Length(6, 6, { message: "Verification code must be 6 digits." })
  verifyCode!: string;
}
