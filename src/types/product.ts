/** Canonical identifiers for bundle builder categories / wizard steps. */
export const CATEGORY_IDS = {
  CAMERAS: 'cameras',
  PLANS: 'plans',
  SENSORS: 'sensors',
  EXTRA_PROTECTION: 'extra-protection',
} as const;

export type CategoryId = (typeof CATEGORY_IDS)[keyof typeof CATEGORY_IDS];

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

export function hasVariants(
  product: Product,
): product is Product & { variants: readonly ProductVariant[] } {
  return Array.isArray(product.variants) && product.variants.length > 0;
}

export function getVariant(
  product: Product,
  variantId: VariantId,
): ProductVariant | undefined {
  return product.variants?.find((variant) => variant.id === variantId);
}

export function resolveProductImage(
  product: Product,
  variantId?: VariantId,
): string {
  if (!variantId) {
    return product.image;
  }

  const variant = getVariant(product, variantId);
  return variant?.image ?? product.image;
}
