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

import { Category } from "../category/category.model";
import { UserActivity } from "../userActivity/userActivity.model";

@Table({
  tableName: "brand",
  timestamps: true,
})
export class Brand extends Model<Brand> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare brandName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare brandSlug: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active: boolean;

  @HasMany(() => Category)
  declare categories: Category[];

  @HasMany(() => UserActivity)
  declare userActivity: UserActivity[];
}
