import { useMemo, useState } from 'react';

import { ProductCard } from '@/components/ProductCard/ProductCard';
import type { ProductCardBadge } from '@/components/ProductCard/ProductCard';
import { getProductsByCategory, resolveProductImageUrl } from '@/data';
import { toSelectionKey } from '@/domain';
import type { Product, ProductId, VariantId } from '@/types';
import type { ReviewSnapshot } from '@/types/review';

const cameraProducts = getProductsByCategory('cameras');

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

/** Composite key: "productId" or "productId:variantId" */
type QuantityKey = string;

function quantityKey(productId: ProductId, variantId?: VariantId): QuantityKey {
  return toSelectionKey(productId, variantId);
}

function BundleBuilder() {
  // All quantities start at 0; keyed per product+variant pair.
  const [quantities, setQuantities] = useState<Record<QuantityKey, number>>({});

  // Active variant shown in each product card.
  const [selectedVariants, setSelectedVariants] = useState<Record<ProductId, VariantId>>(
    () =>
      Object.fromEntries(
        cameraProducts
          .filter((p) => p.variants?.length)
          .map((p) => [p.id, p.variants![0].id]),
      ),
  );

  const getQty = (productId: ProductId, variantId?: VariantId) =>
    quantities[quantityKey(productId, variantId)] ?? 0;

  const updateQuantity = (productId: ProductId, variantId: VariantId | undefined, delta: number) => {
    const key = quantityKey(productId, variantId);
    setQuantities((current) => ({
      ...current,
      [key]: Math.max(0, (current[key] ?? 0) + delta),
    }));
  };

  // Derive ReviewSnapshot from current quantities — only items with qty > 0.
  const reviewSnapshot = useMemo<ReviewSnapshot>(() => {
    const items = cameraProducts.flatMap((product) => {
      if (product.variants?.length) {
        return product.variants
          .map((variant) => {
            const qty = getQty(product.id, variant.id);
            if (qty === 0) return null;
            return {
              key: quantityKey(product.id, variant.id),
              productId: product.id,
              variantId: variant.id,
              categoryId: product.categoryId,
              categoryTitle: 'Cameras',
              title: product.title,
              variantLabel: variant.label,
              image: resolveProductImageUrl(product, variant.id) ?? '',
              quantity: qty,
              unitPrice: product.price,
              compareAtPrice: product.compareAtPrice,
              lineTotal: qty * product.price,
              lineCompareAtTotal: product.compareAtPrice
                ? qty * product.compareAtPrice
                : undefined,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);
      }

      const qty = getQty(product.id);
      if (qty === 0) return [];
      return [
        {
          key: quantityKey(product.id),
          productId: product.id,
          categoryId: product.categoryId,
          categoryTitle: 'Cameras',
          title: product.title,
          image: resolveProductImageUrl(product) ?? '',
          quantity: qty,
          unitPrice: product.price,
          compareAtPrice: product.compareAtPrice,
          lineTotal: qty * product.price,
          lineCompareAtTotal: product.compareAtPrice
            ? qty * product.compareAtPrice
            : undefined,
        },
      ];
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const compareAtSubtotal = items.some((item) => item.compareAtPrice !== undefined)
      ? items.reduce((sum, item) => sum + (item.lineCompareAtTotal ?? item.lineTotal), 0)
      : undefined;

    return {
      items,
      totals: {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        compareAtSubtotal,
        savings: compareAtSubtotal !== undefined ? compareAtSubtotal - subtotal : undefined,
      },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantities]);

  return (
    <div className="container-fluid mx-auto bg-surface p-2">
      {/* Debug: show snapshot item count */}
      <p className="mb-2 text-sm text-gray-600">
        {reviewSnapshot.totals.itemCount} item(s) selected
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 sm:[&>*:last-child]:col-span-2 sm:[&>*:last-child]:justify-self-center sm:[&>*:last-child]:w-1/2 xl:[&>*:last-child]:col-span-1 xl:[&>*:last-child]:justify-self-auto xl:[&>*:last-child]:w-auto">
        {cameraProducts.map((product) => {
          const selectedVariantId = selectedVariants[product.id];
          const currentQty = getQty(product.id, selectedVariantId);

          // A card is highlighted when any variant (or the product itself) has qty > 0.
          const isSelected = product.variants?.length
            ? product.variants.some((v) => getQty(product.id, v.id) > 0)
            : getQty(product.id) > 0;

          return (
            <ProductCard
              key={product.id}
              title={product.title}
              badge={getSavingsBadge(product)}
              description={product.description}
              currentPrice={formatPrice(product.price)}
              compareAtPrice={
                product.compareAtPrice ? formatPrice(product.compareAtPrice) : undefined
              }
              quantity={currentQty}
              quantityMin={0}
              image={resolveProductImageUrl(product)}
              learnMoreUrl={product.learnMoreUrl}
              isSelected={isSelected}
              variants={product.variants?.map((variant) => ({
                id: variant.id,
                label: variant.label,
                image: resolveProductImageUrl(product, variant.id),
                selected: selectedVariantId === variant.id,
                onSelect: () =>
                  setSelectedVariants((current) => ({
                    ...current,
                    [product.id]: variant.id,
                  })),
              }))}
              onQuantityIncrease={() => updateQuantity(product.id, selectedVariantId, 1)}
              onQuantityDecrease={() => updateQuantity(product.id, selectedVariantId, -1)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default BundleBuilder;
