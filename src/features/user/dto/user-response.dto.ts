import { Role, UserGender } from "../user.model";
import { User } from "../user.model";

export class UserResponseDto {
  userName: string;
  email: string;
  phone: string;
  gender: UserGender;
  active: boolean;
  firstLogin: Date | null;
  lastLogin: Date | null;

  constructor(user: User) {
    this.userName = user.userName;
    this.email = user.email;
    this.phone = user.phone;
    this.gender = user.gender;
    this.active = user.active;
    this.firstLogin = user.firstLogin;
    this.lastLogin = user.lastLogin;
  }
}
