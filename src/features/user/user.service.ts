import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role, UserType } from "./user.model";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { AppError } from "../../utils/appError";

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
