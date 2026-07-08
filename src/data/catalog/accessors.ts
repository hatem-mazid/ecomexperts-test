import type {
  Category,
  CategoryId,
  Product,
  ProductId,
  ProductVariant,
  Step,
  StepId,
  VariantId,
} from '@/types';

import type { CatalogIndexes } from './indexes';

export function createCatalogAccessors(
  steps: readonly Step[],
  indexes: CatalogIndexes,
) {
  const { categoryById, stepById, productById, productsByCategoryId } = indexes;

  function getCategoryById(categoryId: CategoryId): Category | undefined {
    return categoryById.get(categoryId);
  }

  function getStepById(stepId: StepId): Step | undefined {
    return stepById.get(stepId);
  }

  function getOrderedSteps(): readonly Step[] {
    return steps;
  }

  function getProductById(productId: ProductId): Product | undefined {
    return productById.get(productId);
  }

  function getProductsByCategory(
    categoryId: CategoryId,
  ): readonly Product[] {
    return productsByCategoryId.get(categoryId) ?? [];
  }

  function getVariantById(
    productId: ProductId,
    variantId: VariantId,
  ): ProductVariant | undefined {
    const product = getProductById(productId);
    return product?.variants?.find((variant) => variant.id === variantId);
  }

  function getCategoryForProduct(
    productId: ProductId,
  ): Category | undefined {
    const product = getProductById(productId);
    return product ? getCategoryById(product.categoryId) : undefined;
  }

  return {
    getCategoryById,
    getStepById,
    getOrderedSteps,
    getProductById,
    getProductsByCategory,
    getVariantById,
    getCategoryForProduct,
  };
}

export type CatalogAccessors = ReturnType<typeof createCatalogAccessors>;
