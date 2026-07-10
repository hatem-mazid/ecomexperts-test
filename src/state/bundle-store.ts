import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { products } from '@/data';
import type { CategoryId, ProductId, VariantId } from '@/types';

export interface SavedBundleSelections {
  quantities: Record<string, number>;
  selectedByCategory: Partial<Record<CategoryId, ProductId>>;
  selectedVariants: Record<ProductId, VariantId>;
  savedAt: number;
}

export type SaveBundleInput = Omit<SavedBundleSelections, 'savedAt'>;

export const defaultSelectedVariants = Object.fromEntries(
  products
    .filter((product) => product.variants?.length)
    .map((product) => [product.id, product.variants![0].id]),
) as Record<ProductId, VariantId>;

interface BundleStore {
  savedSystem: SavedBundleSelections | null;
  saveSystem: (selections: SaveBundleInput) => void;
  clearSavedSystem: () => void;
}

export const useBundleStore = create<BundleStore>()(
  persist(
    (set) => ({
      savedSystem: null,
      saveSystem: (selections) =>
        set({
          savedSystem: { ...selections, savedAt: Date.now() },
        }),
      clearSavedSystem: () => set({ savedSystem: null }),
    }),
    {
      name: 'wyze-saved-bundle',
      partialize: (state) => ({ savedSystem: state.savedSystem }),
    },
  ),
);

export function mergeSavedSelections(
  saved: SavedBundleSelections,
): SaveBundleInput {
  return {
    quantities: saved.quantities,
    selectedByCategory: saved.selectedByCategory,
    selectedVariants: { ...defaultSelectedVariants, ...saved.selectedVariants },
  };
}
