import type { BundleCatalog, BundleCatalogResponse } from '@/types';

import rawCatalog from '@/data/json/catalog.json';

import { buildCatalogIndexes } from './indexes';
import { normalizeCatalog } from './fetch';
import { createCatalogAccessors } from './accessors';

/** Eagerly loaded catalog — mirrors sync bootstrap from a prefetched API response. */
export const bundleCatalog: BundleCatalog = normalizeCatalog(
  rawCatalog as BundleCatalogResponse,
);

export const { categories, products } = bundleCatalog;
export const steps = bundleCatalog.steps;

export const catalogIndexes = buildCatalogIndexes(bundleCatalog);

export const {
  categoryById,
  stepById,
  productById,
  productsByCategoryId,
} = catalogIndexes;

const accessors = createCatalogAccessors(steps, catalogIndexes);

export const {
  getCategoryById,
  getStepById,
  getOrderedSteps,
  getProductById,
  getProductsByCategory,
  getVariantById,
  getCategoryForProduct,
} = accessors;
