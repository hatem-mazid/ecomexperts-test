import type { CategoryId, ProductId, StepId, VariantId } from './product';

/**
 * A single line-item selection within the bundle.
 * Quantities live here — never on catalog product data.
 */
export interface BundleSelection {
  productId: ProductId;
  variantId?: VariantId;
  quantity: number;
}

/** Mutable Zustand state — catalog products remain immutable. */
export interface BundleState {
  currentStepId: StepId;
  selections: Record<CategoryId, BundleSelection[]>;
}

export type BundleSelections = BundleState['selections'];

/** Composite key for deduplicating selections (product + optional variant). */
export type SelectionKey = `${ProductId}` | `${ProductId}:${VariantId}`;
