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
import { User } from "../user/user.model";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { Product } from "../product/product.model";

export enum ActivityTypes {
  CLICK = "click",
  ADDING_FAVOURITE = "addingFavourite",
  SHOPPING = "shopping",
}

@Table({
  tableName: "userActivity",
  timestamps: true,
})
export class UserActivity extends Model<UserActivity> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare user_id: string;

  @ForeignKey(() => Brand)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare brand_id: string;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare category_id: string;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare product_id: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ActivityTypes)))
  declare activityType: ActivityTypes;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active: boolean;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Brand)
  declare brand: Brand;

  @BelongsTo(() => Category)
  declare category: Category;

  @BelongsTo(() => Product)
  declare product: Product;
}
