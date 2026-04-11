import { IsNotEmpty, IsString } from "class-validator";

export class AppleRegisterDto {
  @IsNotEmpty()
  @IsString()
  identityToken!: string; 

  @IsString()
  fullName?: string;
}
