import { Permission } from "./permission.model";
import { User } from "../user/user.model";
import { AppError } from "../../utils/appError";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionResponseDto } from "./dto/permisson-response.dto";

const permissionInclude = [
  {
    model: User,
    as: "user",
    attributes: ["id", "email", "userName",],
  },
];

export const getPermissionByUserService = async (user_id: string) => {
  const item = await Permission.findOne({
    where: { user_id, active: true },
    include: permissionInclude,
  });

  if (!item) throw new AppError("Permission record not found.", 404);

  return { data: new PermissionResponseDto(item) };
};

export const updatePermissionService = async (
  user_id: string,
  dto: UpdatePermissionDto,
) => {
  const item = await Permission.findOne({ where: { user_id, active: true } });
  if (!item) throw new AppError("Permission record not found.", 404);

  await item.update({ ...dto });
  return new PermissionResponseDto(item);
};
