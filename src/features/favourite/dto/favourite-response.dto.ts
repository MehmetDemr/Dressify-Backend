import { Favourite } from "../favourite.model";

export class FavouriteResponseDto {
  id: string;
  user_id: string;
  product_id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(favourite: Favourite) {
    this.id = favourite.id;
    this.user_id = favourite.user_id;
    this.product_id = favourite.product_id;
    this.active = favourite.active;
    this.createdAt = favourite.createdAt;
    this.updatedAt = favourite.updatedAt;
  }
}
