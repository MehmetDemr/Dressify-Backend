import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from "sequelize-typescript";

@Table({
  tableName: "phoneOtp",
  timestamps: true,
})
export class PhoneOtp extends Model<PhoneOtp> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare phone: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare code: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;
}
