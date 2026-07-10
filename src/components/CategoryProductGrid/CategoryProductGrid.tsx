import { memo } from 'react';

import { ProductCard } from '@/components/ProductCard/ProductCard';
import type { ProductCardBadge } from '@/components/ProductCard/ProductCard';
import { getCategoryById, getProductsByCategory, resolveProductImageUrl } from '@/data';
import { toSelectionKey } from '@/domain';
import type { CategoryId, Product, ProductId, VariantId } from '@/types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

function getSavingsBadge(product: Product): ProductCardBadge | undefined {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return undefined;
  }
  const savings = Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
  );
  return { label: `Save ${savings}%`, variant: 'default' };
}

function getGridClassName(categoryId: CategoryId): string {
  if (categoryId === 'cameras') {
    return 'grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-5 sm:[&>*:last-child]:col-span-2 sm:[&>*:last-child]:justify-self-center sm:[&>*:last-child]:w-1/2 2xl:[&>*:last-child]:col-span-1 2xl:[&>*:last-child]:justify-self-auto 2xl:[&>*:last-child]:w-auto';
  }
  return 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3';
}

export interface CategoryProductGridProps {
  categoryId: CategoryId;
  quantities: Record<string, number>;
  selectedVariants: Record<ProductId, VariantId>;
  selectedProductId?: ProductId | null;
  onQuantityChange: (productId: ProductId, variantId: VariantId | undefined, delta: number) => void;
  onVariantSelect: (productId: ProductId, variantId: VariantId) => void;
  onProductSelect?: (productId: ProductId) => void;
}

export const CategoryProductGrid = memo(function CategoryProductGrid({
  categoryId,
  quantities,
  selectedVariants,
  selectedProductId = null,
  onQuantityChange,
  onVariantSelect,
  onProductSelect,
}: CategoryProductGridProps) {
  const category = getCategoryById(categoryId);
  const selectionMode = category?.selectionMode ?? 'multiple';
  const categoryProducts = getProductsByCategory(categoryId);

  function getQty(productId: ProductId, variantId?: VariantId): number {
    return quantities[toSelectionKey(productId, variantId)] ?? 0;
  }

  const sharedCardProps = (product: Product) => ({
    title: product.title,
    badge: getSavingsBadge(product),
    description: product.description,
    currentPrice: formatPrice(product.price),
    compareAtPrice: product.compareAtPrice ? formatPrice(product.compareAtPrice) : undefined,
    image: resolveProductImageUrl(product),
    learnMoreUrl: product.learnMoreUrl,
  });

  if (selectionMode === 'single') {
    return (
      <div
        role="radiogroup"
        aria-label={category?.title ?? categoryId}
        className={getGridClassName(categoryId)}
      >
        {categoryProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...sharedCardProps(product)}
            selectionMode="single"
            selected={selectedProductId === product.id}
            onSelect={() => onProductSelect?.(product.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={getGridClassName(categoryId)}>
      {categoryProducts.map((product) => {
        const selectedVariantId = selectedVariants[product.id];
        const currentQty = getQty(product.id, selectedVariantId);

        const isSelected = product.variants?.length
          ? product.variants.some((v) => getQty(product.id, v.id) > 0)
          : getQty(product.id) > 0;

        return (
          <ProductCard
            key={product.id}
            {...sharedCardProps(product)}
            selectionMode="multiple"
            quantity={currentQty}
            quantityMin={0}
            isSelected={isSelected}
            variants={product.variants?.map((variant) => ({
              id: variant.id,
              label: variant.label,
              image: resolveProductImageUrl(product, variant.id),
              selected: selectedVariantId === variant.id,
              onSelect: () => onVariantSelect(product.id, variant.id),
            }))}
            onQuantityIncrease={() => onQuantityChange(product.id, selectedVariantId, 1)}
            onQuantityDecrease={() => onQuantityChange(product.id, selectedVariantId, -1)}
          />
        );
      })}
    </div>
  );
});
