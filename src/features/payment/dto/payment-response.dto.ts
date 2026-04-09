export class PaymentResponseDto {
  id: string;
  user_id: string;
  cardName: string;

  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    userName: string;
  };

  constructor(payment: any) {
    this.id = payment.id;
    this.user_id = payment.user_id;
    this.cardName = payment.cardName;
    this.active = payment.active;
    this.createdAt = payment.createdAt;
    this.updatedAt = payment.updatedAt;

    if (payment.user) {
      this.user = {
        id: payment.user.id,
        email: payment.user.email,
        userName: payment.user.userName,
      };
    }
  }
}
