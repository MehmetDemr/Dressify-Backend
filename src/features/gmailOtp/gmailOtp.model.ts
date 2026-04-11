import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from "sequelize-typescript";
import { Optional } from "sequelize";

interface GmailOtpAttributes {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

interface GmailOtpCreationAttributes extends Optional<
  GmailOtpAttributes,
  "id" | "attempts"
> {}

@Table({
  tableName: "gmailOtp",
  timestamps: true,
})
export class GmailOtp extends Model<
  GmailOtpAttributes,
  GmailOtpCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare code: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @Default(1)
  @Column(DataType.INTEGER)
  declare attempts: number;
}
