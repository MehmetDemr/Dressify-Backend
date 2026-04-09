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
  tableName: "address",
  timestamps: true,
})
export class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
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
  declare addressName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare apartment: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare floor: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare flat: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare neighbour: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare province: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare district: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @BelongsTo(() => User)
  declare user: User;
}
