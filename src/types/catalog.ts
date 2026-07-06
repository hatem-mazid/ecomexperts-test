import type { Category, Product, Step } from './product';

/** Shape of `GET /api/bundle/catalog` response payload. */
export interface BundleCatalogResponse {
  categories: Category[];
  steps: Step[];
  products: Product[];
}

/** Normalized, immutable catalog after parsing an API response. */
export interface BundleCatalog {
  readonly categories: readonly Category[];
  readonly steps: readonly Step[];
  readonly products: readonly Product[];
}
