export {
  CATEGORY_IDS,
  getVariant,
  hasVariants,
  resolveProductImage,
} from './product';

export type {
  Category,
  CategoryId,
  Product,
  ProductId,
  ProductVariant,
  SelectionMode,
  Step,
  StepId,
  VariantId,
} from './product';

export {
  createEmptySelections,
  createInitialBundleState,
  toSelectionKey,
} from './bundle';

export type {
  BundleSelection,
  BundleSelections,
  BundleState,
  SelectionKey,
} from './bundle';

export type { ReviewItem, ReviewSnapshot, ReviewTotals } from './review';

export type { BundleCatalog, BundleCatalogResponse } from './catalog';
