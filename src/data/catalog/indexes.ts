import type {
  BundleCatalog,
  Category,
  CategoryId,
  Product,
  ProductId,
  Step,
  StepId,
} from '@/types';

export interface CatalogIndexes {
  categoryById: Map<CategoryId, Category>;
  stepById: Map<StepId, Step>;
  productById: Map<ProductId, Product>;
  productsByCategoryId: Map<CategoryId, readonly Product[]>;
}

export function buildCatalogIndexes(catalog: BundleCatalog): CatalogIndexes {
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
