import { products } from '@/data';
import { toSelectionKey } from '@/domain';
import { CATEGORY_IDS } from '@/constants/categories';
import type { CategoryId, ProductId } from '@/types';

function productId(title: string): ProductId {
  const product = products.find((p) => p.title === title);
  if (!product) throw new Error(`Unknown product: ${title}`);
  return product.id;
}

function variantId(productTitle: string, label: string) {
  const product = products.find((p) => p.title === productTitle);
  const variant = product?.variants?.find((v) => v.label === label);
  if (!variant) throw new Error(`Unknown variant: ${label} on ${productTitle}`);
  return variant.id;
}

/** Pre-populated quantities matching the design spec. */
export const seedQuantities: Record<string, number> = {
  [toSelectionKey(productId('Wyze Cam v4'), variantId('Wyze Cam v4', 'White'))]: 1,
  [toSelectionKey(productId('Wyze Cam Pan v3'), variantId('Wyze Cam Pan v3', 'White'))]: 2,
  [toSelectionKey(productId('Wyze Sense Motion Sensor'))]: 2,
  [toSelectionKey(productId('Wyze MicroSD Card (256GB)'))]: 2,
};

/** Pre-selected single-choice category items. */
export const seedSelectedByCategory: Partial<Record<CategoryId, ProductId>> = {
  [CATEGORY_IDS.PLANS]: productId('Cam Unlimited'),
};
