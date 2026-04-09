import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  UUID,
  UUIDV4,
} from "sequelize";
import { User } from "../user/user.model";

@Table({
  tableName: "permission",
  timestamps: true,
})
export class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare user_id: string;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare emailNotifyForNewProduct: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare emailNotifyForDiscount: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare smsNotifyForNewProduct: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare smsNotifyForDiscount: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare smsTwoFA: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare emailToFA: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare newLoginWarning: boolean;

  //We will add this feature for the feature not at the moment.
  //App notify
  //   @Default(false)
  //   @AllowNull(false)
  //   @Column(DataType.BOOLEAN)
  //   declare appAllNotify: boolean;

  //   @Default(false)
  //   @AllowNull(false)
  //   @Column(DataType.BOOLEAN)
  //   declare appFavouriteDiscountNotify: boolean;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @BelongsTo(() => User)
  declare user: User;
}
