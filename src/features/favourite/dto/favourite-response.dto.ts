export class FavouriteResponseDto {
  id: string;
  user_id: string;
  product_id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  product?: {
    id: string;
    productName: string;
    price: number;
    imageUrl: string;
    brandName: string;
    categoryName: string;
  };

  constructor(favourite: any) {
    this.id = favourite.id;
    this.user_id = favourite.user_id;
    this.product_id = favourite.product_id;
    this.active = favourite.active;
    this.createdAt = favourite.createdAt;
    this.updatedAt = favourite.updatedAt;

    const product = favourite.product || favourite.Product;

    if (product) {
      const category = product.category || product.Category;
      const brand = category?.brand || category?.Brand;

      this.product = {
        id: product.id,
        productName: product.productName,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        brandName: brand?.brandName || "Dressify",
        categoryName: category?.categoryName || "",
      };
    }
  }
}

export interface PaginatedFavouriteResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: FavouriteResponseDto[];
}
