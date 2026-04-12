import { IsNotEmpty, MinLength, Matches } from "class-validator";

export class ChangePasswordInProfileDto {
  @IsNotEmpty()
  oldPassword!: string;

  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters." })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message:
      "Password must contain at least 1 uppercase, 1 lowercase and 1 special character.",
  })
  newPassword!: string;
}
