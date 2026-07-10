import { useCallback, useMemo, useState } from 'react';

import { CategoryProductGrid } from '@/components/CategoryProductGrid';
import { ReviewSnapshot } from '@/components/ReviewSnapshot';
import { Accordion } from '@/components/ui/Accordion';
import type { AccordionStep } from '@/components/ui/Accordion';
import {
  getCategoryById,
  getOrderedSteps,
  products,
  resolveProductImageUrl,
} from '@/data';
import { toSelectionKey } from '@/domain';
import { defaultSelectedVariants, useBundleStore } from '@/state/bundle-store';
import { useRestoreSavedBundle } from '@/state/use-restore-saved-bundle';
import type { CategoryId, ProductId, VariantId } from '@/types';
import type { ReviewItem, ReviewSnapshot as ReviewSnapshotData } from '@/types/review';

const catalogSteps = getOrderedSteps();

type QuantityKey = string;

function BundleBuilder() {
  const saveSystem = useBundleStore((state) => state.saveSystem);
  const [openStepId, setOpenStepId] = useState<string>(catalogSteps[0]?.id ?? '');
  const [quantities, setQuantities] = useState<Record<QuantityKey, number>>({});
  const [selectedByCategory, setSelectedByCategory] = useState<
    Partial<Record<CategoryId, ProductId>>
  >({});
  const [selectedVariants, setSelectedVariants] = useState<Record<ProductId, VariantId>>(
    () => ({ ...defaultSelectedVariants }),
  );

  const restoreSavedBundle = useCallback(
    (saved: {
      quantities: Record<string, number>;
      selectedByCategory: Partial<Record<CategoryId, ProductId>>;
      selectedVariants: Record<ProductId, VariantId>;
    }) => {
      setQuantities(saved.quantities);
      setSelectedByCategory(saved.selectedByCategory);
      setSelectedVariants(saved.selectedVariants);
    },
    [],
  );

  useRestoreSavedBundle(restoreSavedBundle);

  const handleStepToggle = (stepId: string) => {
    setOpenStepId((current) => (current === stepId ? '' : stepId));
  };

  const handleNextStep = useCallback((currentStepId: string) => {
    const currentIndex = catalogSteps.findIndex((step) => step.id === currentStepId);
    const nextStep = catalogSteps[currentIndex + 1];
    setOpenStepId(nextStep?.id ?? '');
  }, []);

  const handleQuantityChange = useCallback(
    (productId: ProductId, variantId: VariantId | undefined, delta: number) => {
      const key = toSelectionKey(productId, variantId);
      setQuantities((current) => ({
        ...current,
        [key]: Math.max(0, (current[key] ?? 0) + delta),
      }));
    },
    [],
  );

  const handleVariantSelect = useCallback((productId: ProductId, variantId: VariantId) => {
    setSelectedVariants((current) => ({ ...current, [productId]: variantId }));
  }, []);

  const handleProductSelect = useCallback((categoryId: CategoryId, productId: ProductId) => {
    setSelectedByCategory((current) => ({
      ...current,
      [categoryId]: current[categoryId] === productId ? undefined : productId,
    }));
  }, []);

  const handleSaveForLater = useCallback(() => {
    saveSystem({
      quantities,
      selectedByCategory,
      selectedVariants,
    });
  }, [quantities, selectedByCategory, selectedVariants, saveSystem]);

  const handleReviewQuantityChange = useCallback(
    (item: ReviewItem, delta: number) => {
      const category = getCategoryById(item.categoryId);
      if (category?.selectionMode === 'single') {
        if (delta < 0) {
          setSelectedByCategory((current) => ({
            ...current,
            [item.categoryId]: undefined,
          }));
        }
        return;
      }
      handleQuantityChange(item.productId, item.variantId, delta);
    },
    [handleQuantityChange],
  );

  const reviewSnapshot = useMemo<ReviewSnapshotData>(() => {
    const getQty = (productId: ProductId, variantId?: VariantId) =>
      quantities[toSelectionKey(productId, variantId)] ?? 0;

    const items = products.flatMap((product) => {
      const category = getCategoryById(product.categoryId);
      const categoryTitle = category?.title ?? product.categoryId;

      if (category?.selectionMode === 'single') {
        if (selectedByCategory[product.categoryId] !== product.id) return [];
        return [
          {
            key: toSelectionKey(product.id),
            productId: product.id,
            categoryId: product.categoryId,
            categoryTitle,
            title: product.title,
            image: resolveProductImageUrl(product) ?? '',
            quantity: 1,
            unitPrice: product.price,
            compareAtPrice: product.compareAtPrice,
            lineTotal: product.price,
            lineCompareAtTotal: product.compareAtPrice,
          },
        ];
      }

      if (product.variants?.length) {
        return product.variants
          .map((variant) => {
            const qty = getQty(product.id, variant.id);
            if (qty === 0) return null;
            return {
              key: toSelectionKey(product.id, variant.id),
              productId: product.id,
              variantId: variant.id,
              categoryId: product.categoryId,
              categoryTitle,
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
          key: toSelectionKey(product.id),
          productId: product.id,
          categoryId: product.categoryId,
          categoryTitle,
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
  }, [quantities, selectedByCategory]);

  const selectedCountByCategory = useMemo(
    () =>
      reviewSnapshot.items.reduce<Record<string, number>>((acc, item) => {
        acc[item.categoryId] = (acc[item.categoryId] ?? 0) + 1;
        return acc;
      }, {}),
    [reviewSnapshot.items],
  );

  return (
    <div className="container-fluid mx-auto max-w-screen-2xl pt-12 md:p-2 p-0">
      <h2 className="md:hidden block mb-5 text-3xl text-center font-bold text-gray-obsidian">Let’s get started!</h2>
      <div className="flex flex-col md:gap-6 gap-0 lg:flex-row lg:items-start lg:gap-8 2xl:flex-col">
        <div className="min-w-0 flex-1 w-full">
          <Accordion
            steps={catalogSteps}
            openStepId={openStepId}
            onStepToggle={handleStepToggle}
            onNextStep={handleNextStep}
            getSelectedCount={(step) => selectedCountByCategory[step.id] ?? 0}
            renderPanel={(step: AccordionStep) => (
              <CategoryProductGrid
                categoryId={step.id as CategoryId}
                quantities={quantities}
                selectedVariants={selectedVariants}
                selectedProductId={selectedByCategory[step.id as CategoryId] ?? null}
                onQuantityChange={handleQuantityChange}
                onVariantSelect={handleVariantSelect}
                onProductSelect={(productId) =>
                  handleProductSelect(step.id as CategoryId, productId)
                }
              />
            )}
          />
        </div>

        <aside className="w-full lg:w-96 lg:shrink-0 lg:sticky lg:top-4 2xl:w-full 2xl:static">
          <ReviewSnapshot
            snapshot={reviewSnapshot}
            onQuantityChange={handleReviewQuantityChange}
            onSaveForLater={handleSaveForLater}
          />
        </aside>
      </div>
    </div>
  );
}

export default BundleBuilder;
