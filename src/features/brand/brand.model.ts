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

import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { Category } from "../category/category.model";
import { UserActivity } from "../userActivity/userActivity.model";

@Table({
  tableName: "brand",
  timestamps: true,
})
export class Brand extends Model<
  InferAttributes<Brand>,
  InferCreationAttributes<Brand>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare brandName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare brandSlug: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @HasMany(() => Category)
  declare categories: CreationOptional<Category[]>;

  @HasMany(() => UserActivity)
  declare userActivity: CreationOptional<UserActivity[]>;
}
