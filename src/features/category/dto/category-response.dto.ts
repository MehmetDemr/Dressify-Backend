import { Category } from "../category.model";

export class CategoryResponseDto {
  id: string;
  brand_id: string;
  categoryName: string;
  categorySlug: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.brand_id = category.brand_id;
    this.categoryName = category.categoryName;
    this.categorySlug = category.categorySlug;
    this.active = category.active;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
