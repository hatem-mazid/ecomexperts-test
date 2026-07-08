import type { BundleCatalog, BundleCatalogResponse } from '@/types';

import { withResolvedStepIcons } from './assets';

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
  const { default: catalog } = await import('@/data/json/catalog.json');
  return catalog as BundleCatalogResponse;
}

export function normalizeCatalog(response: BundleCatalogResponse): BundleCatalog {
  const orderedSteps = withResolvedStepIcons(response.steps).sort(
    (a, b) => a.order - b.order,
  );

  return {
    categories: Object.freeze([...response.categories]),
    steps: Object.freeze(orderedSteps),
    products: Object.freeze([...response.products]),
  };
}
