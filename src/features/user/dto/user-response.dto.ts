import { Role, UserGender, UserType } from "../user.model";
import { User } from "../user.model";

export class UserResponseDto {
  id: string;
  userName: string;
  email: string;
  phone: string;
  gender: UserGender;
  role:Role
  active: boolean;
  firstLogin: Date | null;
  lastLogin: Date | null;
  userType: UserType;

  constructor(user: User) {
    this.userName = user.userName;
    this.id=user.id;
    this.email = user.email;
    this.phone = user.phone;
    this.gender = user.gender;
    this.role=user.role;
    this.active = user.active;
    this.firstLogin = user.firstLogin;
    this.lastLogin = user.lastLogin;
    this.userType = user.userType;
  }
}
