export class AddressResponseDto {
  id: string;
  user_id: string;
  addressName: string;
  apartment: string;
  floor: string;
  flat: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  neighbour: string;
  province: string;
  district: string;
  user?: {
    id: string;
    email: string;
    userName: string;
  };

  constructor(address: any) {
    this.id = address.id;
    this.user_id = address.user_id;
    this.addressName = address.addressName;
    this.apartment = address.apartment;
    this.floor = address.floor;
    this.flat = address.flat;
    this.neighbour = address.neighbour;
    this.province = address.neighbour;
    this.district = address.district;
    this.active = address.active;
    this.createdAt = address.createdAt;
    this.updatedAt = address.updatedAt;

    if (address.user) {
      this.user = {
        id: address.user.id,
        email: address.user.email,
        userName: address.user.userName,
      };
    }
  }
}
