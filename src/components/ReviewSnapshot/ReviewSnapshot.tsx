import { useMemo } from 'react';

import { FlashMessage, useFlashMessage } from '@/components/ui/FlashMessage';
import { CATEGORY_IDS } from '@/constants/categories';
import { groupReviewItems } from '@/domain';
import type { ReviewItem, ReviewSnapshot as ReviewSnapshotData } from '@/types/review';
import fastShippingUrl from '@assets/images/others/fast-shipping.png';

import { cn } from '@/utils';
import { ReviewItemsSection } from './ReviewItemsSection';
import { ReviewSummarySection } from './ReviewSummarySection';

const FAST_SHIPPING_ITEM: ReviewItem = {
  key: 'fast-shipping',
  productId: 0,
  categoryId: CATEGORY_IDS.PLANS,
  categoryTitle: 'Plans',
  title: 'Fast Shipping',
  image: fastShippingUrl,
  quantity: 1,
  unitPrice: 0,
  compareAtPrice: 5.99,
  lineTotal: 0,
  lineCompareAtTotal: 5.99,
};

export interface ReviewSnapshotProps {
  snapshot: ReviewSnapshotData;
  onQuantityChange: (item: ReviewItem, delta: number) => void;
  onSaveForLater: () => void;
  className?: string;
}

export function ReviewSnapshot({
  snapshot,
  onQuantityChange,
  onSaveForLater,
  className,
}: ReviewSnapshotProps) {
  const { totals } = snapshot;
  const planItem = snapshot.items.find((item) => item.categoryId === CATEGORY_IDS.PLANS);
  const hasItems = snapshot.items.length > 0;
  const hasSavings = totals.savings !== undefined && totals.savings > 0;
  const { message: flashMessage, showFlash } = useFlashMessage();
  const groupedCategories = useMemo(() => {
    const groups = groupReviewItems(snapshot.items);

    if (!planItem) {
      return groups;
    }

    return groups.map((group) =>
      group.categoryId === CATEGORY_IDS.PLANS
        ? { ...group, items: [...group.items, FAST_SHIPPING_ITEM] }
        : group,
    );
  }, [snapshot.items, planItem]);

  const handleSaveForLater = () => {
    onSaveForLater();
    showFlash('Your system has been saved successfully.');
  };

  return (
    <>
      <FlashMessage message={flashMessage} />

      <div
        className={cn(
          'flex flex-col gap-6 md:rounded-xl rounded-none bg-surface p-4',
          '2xl:flex-row 2xl:gap-8',
          className,
        )}
      >
        <ReviewItemsSection
          groupedCategories={groupedCategories}
          onQuantityChange={onQuantityChange}
        />

        <ReviewSummarySection
          planItem={planItem}
          totals={totals}
          hasItems={hasItems}
          hasSavings={hasSavings}
          onSaveForLater={handleSaveForLater}
        />
      </div>
    </>
  );
}
