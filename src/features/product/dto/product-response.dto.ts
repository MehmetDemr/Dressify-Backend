import { Product } from "../product.model";

export class ProductResponseDto {
  id: string;
  category_id: string;
  productName: string;
  productSlug: string;
  description: string | null;
  price: number;
  imageUrl: string;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.category_id = product.category_id;
    this.productName = product.productName;
    this.productSlug = product.productSlug;
    this.description = product.description;
    this.price = Number(product.price);
    this.stock = Number(product.stock);
    this.imageUrl = product.imageUrl;
    this.active = product.active;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
