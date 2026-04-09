import { Payment } from "./payment.model";
import { User } from "../user/user.model";
import { AppError } from "../../utils/appError";
import { PaymentResponseDto } from "./dto/payment-response.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";

const paymentInclude = [
  {
    model: User,
    as: "user",
    attributes: ["id", "email", "userName"],
  },
];

export const getPaymentsService = async (user_id: string) => {
  const items = await Payment.findAll({
    where: { user_id, active: true },
    include: paymentInclude,
    order: [["createdAt", "DESC"]],
  });

  const data = items.map((item) => new PaymentResponseDto(item));
  return { data, meta: { itemCount: data.length } };
};

export const getPaymentByIdService = async (id: string, user_id: string) => {
  const item = await Payment.findOne({
    where: { id, user_id, active: true },
    include: paymentInclude,
  });

  if (!item) throw new AppError("Payment not found.", 404);

  return new PaymentResponseDto(item);
};

export const createPaymentService = async (
  user_id: string,
  dto: CreatePaymentDto,
) => {
  const item = await Payment.create({
    user_id,
    ...dto,
    active: true,
  } as any);

  return new PaymentResponseDto(item);
};

export const updatePaymentService = async (
  id: string,
  user_id: string,
  dto: UpdatePaymentDto,
) => {
  const item = await Payment.findOne({ where: { id, user_id, active: true } });
  if (!item) throw new AppError("Payment not found.", 404);

  await item.update({ ...dto });
  return new PaymentResponseDto(item);
};

export const deletePaymentService = async (id: string, user_id: string) => {
  const item = await Payment.findOne({ where: { id, user_id, active: true } });
  if (!item) throw new AppError("Payment not found.", 404);

  await item.destroy();
  return { message: "Payment removed successfully." };
};
