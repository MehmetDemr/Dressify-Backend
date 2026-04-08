export class CardResponseDto {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: string;
    productName: string;
    productSlug: string;
    price: number;
    stock: number;
    imageUrl: string;
    description: string;
    category?: {
      id: string;
      categoryName: string;
      categorySlug: string;
      brand?: {
        id: string;
        brandName: string;
        brandSlug: string;
      };
    };
  };

  constructor(card: any) {
    this.id = card.id;
    this.user_id = card.user_id;
    this.product_id = card.product_id;
    this.quantity = card.quantity;
    this.active = card.active;
    this.createdAt = card.createdAt;
    this.updatedAt = card.updatedAt;

    if (card.product) {
      this.product = {
        id: card.product.id,
        productName: card.product.productName,
        productSlug: card.product.productSlug,
        price: card.product.price,
        stock: card.product.stock,
        imageUrl: card.product.imageUrl,
        description: card.product.description,
        category: card.product.category
          ? {
              id: card.product.category.id,
              categoryName: card.product.category.categoryName,
              categorySlug: card.product.category.categorySlug,
              brand: card.product.category.brand
                ? {
                    id: card.product.category.brand.id,
                    brandName: card.product.category.brand.brandName,
                    brandSlug: card.product.category.brand.brandSlug,
                  }
                : undefined,
            }
          : undefined,
      };
    }
  }
}
