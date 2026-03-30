import { Brand } from "../brand.model";

export class BrandResponseDto {
  id: string;
  brandName: string;
  brandSlug: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(brand: Brand) {
    this.id = brand.id;
    this.brandName = brand.brandName;
    this.brandSlug = brand.brandSlug;
    this.active = brand.active;
    this.createdAt = brand.createdAt;
    this.updatedAt = brand.updatedAt;
  }
}
