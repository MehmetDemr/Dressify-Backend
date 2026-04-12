import { IsNotEmpty, IsJWT, Matches } from "class-validator";

export class SendNewPhoneOtpDto {
  @IsNotEmpty()
  @IsJWT()
  phoneChangeToken!: string;

  @IsNotEmpty()
  @Matches(/^\+90\d{10}$/, {
    message: "Phone must be in +90XXXXXXXXXX format.",
  })
  newPhone!: string;
}
