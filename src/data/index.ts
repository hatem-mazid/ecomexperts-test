export { resolveProductImageUrl } from './catalog/assets';
export { fetchBundleCatalog, normalizeCatalog } from './catalog/fetch';
export { buildCatalogIndexes } from './catalog/indexes';
export type { CatalogIndexes } from './catalog/indexes';
export { createCatalogAccessors } from './catalog/accessors';
export type { CatalogAccessors } from './catalog/accessors';

export {
  bundleCatalog,
  categories,
  products,
  steps,
  catalogIndexes,
  categoryById,
  stepById,
  productById,
  productsByCategoryId,
  getCategoryById,
  getStepById,
  getOrderedSteps,
  getProductById,
  getProductsByCategory,
  getVariantById,
  getCategoryForProduct,
} from './catalog/catalog-state';

import type { BundleCatalog } from '@/types';

import { fetchBundleCatalog, normalizeCatalog } from './catalog/fetch';
import { buildCatalogIndexes } from './catalog/indexes';
import type { CatalogIndexes } from './catalog/indexes';

/**
 * Loads catalog from the API layer and rebuilds lookup indexes.
 * Use when hydrating the app asynchronously (e.g. React Query / useEffect).
 */
export async function loadBundleCatalog(): Promise<{
  catalog: BundleCatalog;
  indexes: CatalogIndexes;
}> {
  const response = await fetchBundleCatalog();
  const catalog = normalizeCatalog(response);
  return { catalog, indexes: buildCatalogIndexes(catalog) };
}
