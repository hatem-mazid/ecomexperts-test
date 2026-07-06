import type {
  BundleState,
  Category,
  CategoryId,
  Product,
  ProductId,
  ProductVariant,
  Step,
  StepId,
  VariantId,
} from '../types';
import type { BundleCatalog, BundleCatalogResponse } from '../types/catalog';

import { createInitialBundleState } from '../types';

import rawCatalog from './json/catalog.json';

const stepIcons = import.meta.glob<string>('../assets/icons/*.svg', {
  eager: true,
  import: 'default',
});

function resolveStepIcon(iconPath: string): string {
  const filename = iconPath.split('/').pop() ?? iconPath;
  const key = `../assets/icons/${filename}`;
  return stepIcons[key] ?? iconPath;
}

function withResolvedStepIcons(steps: BundleCatalogResponse['steps']): Step[] {
  return steps.map((step) => ({
    ...step,
    icon: resolveStepIcon(step.icon),
  }));
}

// ---------------------------------------------------------------------------
// API layer — swap the body of fetchBundleCatalog() for a real fetch call
// ---------------------------------------------------------------------------

/**
 * Simulates fetching the bundle catalog from an API.
 *
 * @example Production swap:
 * ```ts
 * const response = await fetch('/api/bundle/catalog');
 * if (!response.ok) throw new Error('Failed to load bundle catalog');
 * return response.json();
 * ```
 */
export async function fetchBundleCatalog(): Promise<BundleCatalogResponse> {
  const { default: catalog } = await import('./json/catalog.json');
  return catalog as BundleCatalogResponse;
}

function normalizeCatalog(response: BundleCatalogResponse): BundleCatalog {
  const orderedSteps = withResolvedStepIcons(response.steps).sort(
    (a, b) => a.order - b.order,
  );

  return {
    categories: Object.freeze([...response.categories]),
    steps: Object.freeze(orderedSteps),
    products: Object.freeze([...response.products]),
  };
}

/** Eagerly loaded catalog — mirrors sync bootstrap from a prefetched API response. */
export const bundleCatalog: BundleCatalog = normalizeCatalog(
  rawCatalog as BundleCatalogResponse,
);

export const { categories, products } = bundleCatalog;
export const steps = bundleCatalog.steps;

// ---------------------------------------------------------------------------
// Lookup indexes (built once from API payload)
// ---------------------------------------------------------------------------

interface CatalogIndexes {
  categoryById: Map<CategoryId, Category>;
  stepById: Map<StepId, Step>;
  productById: Map<ProductId, Product>;
  productsByCategoryId: Map<CategoryId, readonly Product[]>;
}

function buildCatalogIndexes(catalog: BundleCatalog): CatalogIndexes {
  const categoryById = new Map<CategoryId, Category>(
    catalog.categories.map((category) => [category.id, category]),
  );

  const stepById = new Map<StepId, Step>(
    catalog.steps.map((step) => [step.id, step]),
  );

  const productById = new Map<ProductId, Product>(
    catalog.products.map((product) => [product.id, product]),
  );

  const productsByCategoryId = catalog.products.reduce<
    Map<CategoryId, readonly Product[]>
  >((index, product) => {
    const existing = index.get(product.categoryId) ?? [];
    index.set(product.categoryId, [...existing, product]);
    return index;
  }, new Map());

  return { categoryById, stepById, productById, productsByCategoryId };
}

const indexes = buildCatalogIndexes(bundleCatalog);

const {
  categoryById,
  stepById,
  productById,
  productsByCategoryId,
} = indexes;

// ---------------------------------------------------------------------------
// Catalog accessors
// ---------------------------------------------------------------------------

export function getCategoryById(categoryId: CategoryId): Category | undefined {
  return categoryById.get(categoryId);
}

export function getStepById(stepId: StepId): Step | undefined {
  return stepById.get(stepId);
}

export function getOrderedSteps(): readonly Step[] {
  return steps;
}

export function getProductById(productId: ProductId): Product | undefined {
  return productById.get(productId);
}

export function getProductsByCategory(
  categoryId: CategoryId,
): readonly Product[] {
  return productsByCategoryId.get(categoryId) ?? [];
}

export function getVariantById(
  productId: ProductId,
  variantId: VariantId,
): ProductVariant | undefined {
  const product = getProductById(productId);
  return product?.variants?.find((variant) => variant.id === variantId);
}

export function getCategoryForProduct(productId: ProductId): Category | undefined {
  const product = getProductById(productId);
  return product ? getCategoryById(product.categoryId) : undefined;
}

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

/** Default bundle state for Zustand store initialization. */
export function getInitialBundleState(): BundleState {
  return createInitialBundleState(steps[0]?.id ?? 'cameras');
}

export {
  categoryById,
  productById,
  productsByCategoryId,
  stepById,
};

export type { CatalogIndexes };
