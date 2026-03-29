import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
} from "sequelize-typescript";
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
}

@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: CreationOptional<string>;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare userName: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare phone: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserGender)))
  declare gender: UserGender;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare active: CreationOptional<boolean>;

  @AllowNull(false)
  @Default(Role.USER)
  @Column(DataType.ENUM(...Object.values(Role)))
  declare role: CreationOptional<Role>;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare firstLogin: CreationOptional<Date>;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare lastLogin: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare createdAt: CreationOptional<Date>;

  @Column(DataType.DATE)
  declare updatedAt: CreationOptional<Date>;
}
