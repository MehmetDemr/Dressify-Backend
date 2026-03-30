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
import { Brand } from "../brand/brand.model";
import { UserActivity } from "../userActivity/userActivity.model";

@Table({ tableName: "category", timestamps: true })
export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => Brand)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare brand_id: string;

  @BelongsTo(() => Brand)
  declare brand: Brand;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare categoryName: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare categorySlug: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @HasMany(() => UserActivity)
  declare userActivity: CreationOptional<UserActivity[]>;
}
