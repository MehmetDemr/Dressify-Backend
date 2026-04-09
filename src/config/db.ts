import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { Brand } from "../features/brand/brand.model";
import { Category } from "../features/category/category.model";
import { Favourite } from "../features/favourite/favourite.model";
import { GmailOtp } from "../features/gmailOtp/gmailOtp.model";
import { PhoneOtp } from "../features/phoneOtp/phoneOtp.model";
import { Product } from "../features/product/product.model";
import { User } from "../features/user/user.model";
import { UserActivity } from "../features/userActivity/userActivity.model";
import { Card } from "../features/card/card.model";
import { Permission } from "../features/permission/permission.model";
import { Payment } from "../features/payment/payment.model";
import { Address } from "../features/address/address.model";

const useSSL = process.env.DB_SSL === "true";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging: false,
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  models: [
    Brand,
    Category,
    Favourite,
    GmailOtp,
    PhoneOtp,
    Product,
    User,
    UserActivity,
    Card,
    Permission,
    Payment,
    Address,
  ],
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("DB conn successfull.");
  } catch (error) {
    console.error("DB conn error:", error);
    process.exit(1);
  }
};
