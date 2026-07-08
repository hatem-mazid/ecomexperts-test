import type { CategoryId } from '@/constants/categories';

export type { CategoryId };

/** Wizard step identifiers — 1:1 with categories in this application. */
export type StepId = CategoryId;

export type SelectionMode = 'single' | 'multiple';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  selectionMode: SelectionMode;
}

export interface Step {
  id: StepId;
  categoryId: CategoryId;
  title: string;
  description: string;
  order: number;
  icon: string;
}

export type ProductId = number;
export type VariantId = number;

export interface ProductVariant {
  id: VariantId;
  label: string;
  image?: string;
}

export interface Product {
  id: ProductId;
  categoryId: CategoryId;
  title: string;
  description: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  variants?: readonly ProductVariant[];
  learnMoreUrl?: string;
}
