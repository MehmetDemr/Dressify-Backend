export class PermissionResponseDto {
  id: string;
  user_id: string;
  emailNotifyForNewProduct: boolean;
  emailNotifyForDiscount: boolean;
  smsNotifyForNewProduct: boolean;
  smsNotifyForDiscount: boolean;
  smsTwoFA: boolean;
  emailToFA: boolean;
  newLoginWarning: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    userName: string;
  };

  constructor(permission: any) {
    this.id = permission.id;
    this.user_id = permission.user_id;
    this.emailNotifyForNewProduct = permission.emailNotifyForNewProduct;
    this.emailNotifyForDiscount = permission.emailNotifyForDiscount;
    this.smsNotifyForNewProduct = permission.smsNotifyForNewProduct;
    this.smsNotifyForDiscount = permission.smsNotifyForDiscount;
    this.smsTwoFA = permission.smsTwoFA;
    this.emailToFA = permission.emailToFA;
    this.newLoginWarning = permission.newLoginWarning;
    this.active = permission.active;
    this.createdAt = permission.createdAt;
    this.updatedAt = permission.updatedAt;

    if (permission.user) {
      this.user = {
        id: permission.user.id,
        email: permission.user.email,
        userName: permission.user.userName,
      };
    }
  }
}
