import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { Favourite } from "../favourite/favourite.model";
import { UserActivity } from "../userActivity/userActivity.model";

export enum UserGender {
  MAN = "man",
  WOMAN = "woman",
  NO_SPECIFY = "noSpecify",
}

export enum Role {
  ADMIN = "admin",
  MERCHANT = "merchant",
  USER = "user",
}

@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare userName: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserGender)))
  declare gender: UserGender;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare firstLogin: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare lastLogin: Date;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare address: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare phone: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Role)))
  declare role: Role;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active: boolean;

  @HasMany(() => Favourite)
  declare favourites: Favourite[];

  @HasMany(() => UserActivity)
  declare userActivity: UserActivity[];
}
