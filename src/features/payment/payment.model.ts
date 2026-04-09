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
  tableName: "payment",
  timestamps: true,
})
export class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare user_id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare cardName:string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare cardNumber:string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare cardExpireDate:string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare cardCVV:string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @BelongsTo(() => User)
  declare user: User;
}
