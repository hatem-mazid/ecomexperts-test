import type { CategoryId, ProductId, VariantId } from './product';

/**
 * Resolved line item for the review panel.
 * Built from immutable catalog data + mutable bundle selections.
 */
export interface ReviewItem {
  /** Stable key: productId or productId:variantId */
  key: string;
  productId: ProductId;
  variantId?: VariantId;
  categoryId: CategoryId;
  categoryTitle: string;
  title: string;
  variantLabel?: string;
  image: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
  lineTotal: number;
  lineCompareAtTotal?: number;
}

export interface ReviewTotals {
  itemCount: number;
  subtotal: number;
  compareAtSubtotal?: number;
  savings?: number;
}

export interface ReviewSnapshot {
  items: ReviewItem[];
  totals: ReviewTotals;
}
