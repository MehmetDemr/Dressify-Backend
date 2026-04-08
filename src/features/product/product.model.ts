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
  HasMany,
} from "sequelize-typescript";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { Category } from "../category/category.model";
import { Favourite } from "../favourite/favourite.model";
import { UserActivity } from "../userActivity/userActivity.model";

@Table({ tableName: "product", timestamps: true })
export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare category_id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare productName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare productSlug: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare description: CreationOptional<string>;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  declare price: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare imageUrl: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  declare stock: number;

  @BelongsTo(() => Category)
  declare category: Category;

  @HasMany(() => Favourite)
  declare favourites: CreationOptional<Favourite[]>;

  @HasMany(() => UserActivity)
  declare userActivity: CreationOptional<UserActivity[]>;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;
}
