import type { Category } from "@/shared/types/category";
import type { Image } from "@/shared/types/image";

export interface Variant {
  id?: number;
  sku: string;
  retailPrice?: number | undefined;
  wholesalePrice?: number | undefined;
}

// Tipo para los productos
export interface Product {
  id?: number;
  name: string;
  slug: string;
  sku?: string;
  description: string;
  stock?: number;
  isActive: boolean;
  isFeatured: boolean;
  retailPrice?: number | undefined;
  wholesalePrice?: number | undefined;
  priceUpdatedAt?: string;
  priceUpdated?: string;
  relatedProducts: number[] | null;
  images: Image[] | null;
  categories: Category[] | null;
  relatedProductIds?: number[] | null;
  categoryIds: number[] | null;
  variants: Variant[] | null;
}

export interface ProductWithDetails extends Product {
  detCategories: Category[];
  detImages: Image[];
}

export interface ProductCreate extends Omit<
  Product,
  "id" | "categories" | "images" | "relatedProducts"
> {
  relatedProductIds?: number[] | null;
  categoryIds: number[] | null;
  images: Image[] | null;
}
