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
  NonAttribute, // Bunu ekleyin
} from "sequelize";
import { User } from "../user/user.model";
import { Product } from "../product/product.model";

@Table({ tableName: "favourite", timestamps: true })
export class Favourite extends Model<
  InferAttributes<Favourite>,
  InferCreationAttributes<Favourite>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare user_id: string;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare product_id: string;

  @BelongsTo(() => User)
  declare user?: NonAttribute<User>;

  @BelongsTo(() => Product)
  declare product?: NonAttribute<Product>;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;
}
