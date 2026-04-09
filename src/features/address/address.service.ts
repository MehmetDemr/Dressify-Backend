import { Address } from "./address.model";
import { User } from "../user/user.model";
import { AppError } from "../../utils/appError";
import { AddressResponseDto } from "./dto/address-response.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

const addressInclude = [
  {
    model: User,
    as: "user",
    attributes: ["id", "email", "userName"],
  },
];

export const getAddressesService = async (user_id: string) => {
  const items = await Address.findAll({
    where: { user_id, active: true },
    include: addressInclude,
    order: [["createdAt", "DESC"]],
  });

  const data = items.map((item) => new AddressResponseDto(item));
  return { data, meta: { itemCount: data.length } };
};

export const getAddressByIdService = async (id: string, user_id: string) => {
  const item = await Address.findOne({
    where: { id, user_id, active: true },
    include: addressInclude,
  });

  if (!item) throw new AppError("Address not found.", 404);

  return new AddressResponseDto(item);
};

export const createAddressService = async (
  user_id: string,
  dto: CreateAddressDto,
) => {
  const item = await Address.create({
    user_id,
    ...dto,
    active: true,
  } as any);

  return new AddressResponseDto(item);
};

export const updateAddressService = async (
  id: string,
  user_id: string,
  dto: UpdateAddressDto,
) => {
  const item = await Address.findOne({ where: { id, user_id, active: true } });
  if (!item) throw new AppError("Address not found.", 404);

  await item.update({ ...dto });
  return new AddressResponseDto(item);
};

export const deleteAddressService = async (id: string, user_id: string) => {
  const item = await Address.findOne({ where: { id, user_id, active: true } });
  if (!item) throw new AppError("Address not found.", 404);

  await item.destroy();
  return { message: "Address removed successfully." };
};
