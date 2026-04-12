import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role, UserType, UserGender } from "./user.model";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { AppError } from "../../utils/appError";
import { Permission } from "../permission/permission.model";
import crypto from "crypto";
import { GoogleRegisterDto } from "./dto/google-register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ChangePersonalInfoDto } from "./dto/change-personal-info.dto";
import { ChangePasswordInProfileDto } from "./dto/change-password-in-profile.dto";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerService = async (dto: RegisterDto) => {
  const existingEmail = await User.findOne({ where: { email: dto.email } });
  if (existingEmail) throw new AppError("This email is already signed.", 409);

  const existingUsername = await User.findOne({
    where: { userName: dto.userName },
  });
  if (existingUsername)
    throw new AppError("This username is already signed.", 409);

  const existingNumber = await User.findOne({ where: { phone: dto.phone } });
  if (existingNumber) throw new AppError("This phone is already signed.", 409);

  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const user = await User.create({
    ...dto,
    password: hashedPassword,
    role: Role.USER,
    userType: UserType.STANDART,
    active: true,
    firstLogin: new Date(),
    lastLogin: new Date(),
  });

  await Permission.create({
    user_id: user.id,
    emailNotifyForNewuser: false,
    emailNotifyForDiscount: false,
    smsNotifyForNewuser: false,
    smsNotifyForDiscount: false,
    smsTwoFA: false,
    emailToFA: false,
    newLoginWarning: false,
    active: true,
  } as any);

  return new UserResponseDto(user);
};

export const loginService = async (dto: LoginDto) => {
  const user = await User.findOne({ where: { email: dto.email } });
  if (!user) throw new AppError("User not found.", 404);

  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials.", 401);

  await user.update({ lastLogin: new Date() });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user: new UserResponseDto(user) };
};

export const getMeService = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

export const deleteUserService = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) throw new AppError("User not found.", 404);

  await user.destroy();

  return { message: "User deleted successfully." };
};

const generateRandomPassword = (): string => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const special = '!@#$%^&*(),.?":{}|<>';
  const digits = "0123456789";
  const all = upper + lower + special + digits;

  const pick = (pool: string) => pool[crypto.randomInt(0, pool.length)];

  const mandatory = [pick(upper), pick(lower), pick(special)];

  const totalLength = crypto.randomInt(15, 26);
  const remaining = totalLength - mandatory.length;

  const rest = Array.from({ length: remaining }, () => pick(all));

  const chars = [...mandatory, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};

export const googleRegisterService = async (dto: GoogleRegisterDto) => {
  const existingEmail = await User.findOne({ where: { email: dto.email } });
  if (existingEmail) throw new AppError("This email is already signed.", 409);

  const existingUsername = await User.findOne({
    where: { userName: dto.userName },
  });
  if (existingUsername)
    throw new AppError("This username is already signed.", 409);

  const rawPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await User.create({
    userName: dto.userName,
    email: dto.email,
    phone: dto.phone ?? null,
    gender: UserGender.UNKNOWN,
    password: hashedPassword,
    role: Role.USER,
    userType: UserType.GOOGLE,
    active: true,
    firstLogin: new Date(),
    lastLogin: new Date(),
  });

  await Permission.create({
    user_id: user.id,
    emailNotifyForNewuser: false,
    emailNotifyForDiscount: false,
    smsNotifyForNewuser: false,
    smsNotifyForDiscount: false,
    smsTwoFA: false,
    emailToFA: false,
    newLoginWarning: false,
    active: true,
  } as any);

  return new UserResponseDto(user);
};

// Google Login
export const googleLoginService = async (email: string) => {
  const user = await User.findOne({
    where: {
      email,
      userType: UserType.GOOGLE,
      active: true,
    },
  });

  if (!user)
    throw new AppError("No Google account found with this email.", 404);

  await user.update({ lastLogin: new Date() });

  return new UserResponseDto(user);
};

//Forgot Password

export const ForgotPasswordService = async (dto: ForgotPasswordDto) => {
  //Token validation
  let payload: any;
  try {
    payload = jwt.verify(dto.resetToken, process.env.JWT_SECRET!);
  } catch {
    throw new AppError("Reset token is invalid or has expired.", 400);
  }

  // Purpose control
  if (payload.purpose !== "password_reset") {
    throw new AppError("Invalid token.", 403);
  }

  // Find user
  const user = await User.findOne({
    where: payload.email ? { email: payload.email } : { phone: payload.phone },
  });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Hash password
  const hashed = await bcrypt.hash(dto.newPassword, 10);
  await user.update({ password: hashed });

  return { message: "Password has been reset successfully." };
};

//Change Personal Info

export const ChangePersonalInfoService = async (
  userId: string,
  dto: ChangePersonalInfoDto,
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  user.userName = dto.newUserName;
  user.gender = dto.newGender;

  await user.save();

  return user;
};

//Change password

export const ChangePasswordInProfileService = async (
  userId: string,
  dto: ChangePasswordInProfileDto,
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isMatch = await bcrypt.compare(dto.oldPassword, user.password);

  if (!isMatch) {
    throw new AppError("Password is not correct.", 401);
  }

  user.password = await bcrypt.hash(dto.newPassword, 10);
  await user.save();

  return { message: "Password updated successfully." };
};
