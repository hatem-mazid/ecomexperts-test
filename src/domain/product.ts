import type { Product, ProductVariant, VariantId } from '@/types/product';

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
