import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { User } from "../user/user.model";
import { Product } from "../product/product.model";

@Table({ tableName: "card", timestamps: true })
export class Card extends Model<
  InferAttributes<Card>,
  InferCreationAttributes<Card>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare user_id: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare product_id: string;

  @Default(1)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: CreationOptional<number>;

  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare active: CreationOptional<boolean>;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Product)
  declare product: Product;
}
