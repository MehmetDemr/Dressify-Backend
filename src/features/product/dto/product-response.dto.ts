import { Product } from "../product.model";

export interface PaginatedProductResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: ProductResponseDto[];
}

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
  isFavourite?: boolean;

  category: {
    id: string;
    categoryName: string;
    categorySlug: string;
    brand_id: string;
    brand: {
      id: string;
      brandName: string;
      brandSlug: string;
    } | null;
  } | null;

  constructor(product: any) {
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

    this.category = product.category
      ? {
          id: product.category.id,
          categoryName: product.category.categoryName,
          categorySlug: product.category.categorySlug,
          brand_id: product.category.brand_id,
          brand: product.category.brand
            ? {
                id: product.category.brand.id,
                brandName: product.category.brand.brandName,
                brandSlug: product.category.brand.brandSlug,
              }
            : null,
        }
      : null;
  }
}
