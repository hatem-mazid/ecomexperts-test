import { CATEGORY_IDS } from '@/constants/categories';
import type { BundleSelection, BundleState, SelectionKey } from '@/types/bundle';
import type { CategoryId, ProductId, StepId, VariantId } from '@/types/product';

export function toSelectionKey(
  productId: ProductId,
  variantId?: VariantId,
): SelectionKey {
  return variantId !== undefined ? `${productId}:${variantId}` : `${productId}`;
}

export function createEmptySelections(
  categoryIds: readonly CategoryId[],
): Record<CategoryId, BundleSelection[]> {
  return categoryIds.reduce<Record<CategoryId, BundleSelection[]>>(
    (selections, categoryId) => {
      selections[categoryId] = [];
      return selections;
    },
    {} as Record<CategoryId, BundleSelection[]>,
  );
}

export function createInitialBundleState(
  categoryIds: readonly CategoryId[],
  firstStepId: StepId = categoryIds[0] ?? CATEGORY_IDS.CAMERAS,
): BundleState {
  return {
    currentStepId: firstStepId,
    selections: createEmptySelections(categoryIds),
  };
}
