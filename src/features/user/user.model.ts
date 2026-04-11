import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import { Favourite } from "../favourite/favourite.model";
import { Card } from "../card/card.model";
import { Payment } from "../payment/payment.model";
import { UserActivity } from "../userActivity/userActivity.model";
import { Address } from "../address/address.model";
import { Permission } from "../permission/permission.model";

export enum Role {
  USER = "user",
  ADMIN = "admin",
  MERCHANT = "merchant",
}

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  UNKNOWN = "unknown",
}

export enum UserType {
  GOOGLE = "google_user",
  APPLE = "apple_user",
  STANDART = "standart_user",
}

@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare userName: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING)
  declare phone: string | null;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserGender)))
  declare gender: UserGender;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @AllowNull(false)
  @Default(UserType.STANDART)
  @Column(DataType.ENUM(...Object.values(UserType)))
  declare userType: CreationOptional<UserType>;

  @AllowNull(false)
  @Default(Role.USER)
  @Column(DataType.ENUM(...Object.values(Role)))
  declare role: CreationOptional<Role>;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare firstLogin: CreationOptional<Date>;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare lastLogin: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>;

  @HasMany(() => Favourite, { onDelete: "CASCADE", hooks: true })
  declare favourites: NonAttribute<Favourite[]>;

  @HasMany(() => Card, { onDelete: "CASCADE", hooks: true })
  declare cards: NonAttribute<Card[]>;

  @HasMany(() => Payment, { onDelete: "CASCADE", hooks: true })
  declare payments: NonAttribute<Payment[]>;

  @HasMany(() => UserActivity, { onDelete: "CASCADE", hooks: true })
  declare userActivities: NonAttribute<UserActivity[]>;

  @HasMany(() => Address, { onDelete: "CASCADE", hooks: true })
  declare addresses: NonAttribute<Address[]>;

  @HasOne(() => Permission, { onDelete: "CASCADE", hooks: true })
  declare permissions: NonAttribute<Permission[]>;
}
