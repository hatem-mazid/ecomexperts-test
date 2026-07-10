import { useMemo } from 'react';

import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { FlashMessage, useFlashMessage } from '@/components/ui/FlashMessage';
import { CATEGORY_IDS } from '@/constants/categories';
import { getCategoryById, getOrderedSteps } from '@/data';
import type { ReviewItem, ReviewSnapshot as ReviewSnapshotData } from '@/types/review';
import guaranteeBadgeUrl from '@assets/images/others/guarantee-badge.png';
import { Button } from '../ui/Button';

export interface ReviewSnapshotProps {
  snapshot: ReviewSnapshotData;
  onQuantityChange: (item: ReviewItem, delta: number) => void;
  onSaveForLater: () => void;
  className?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

const formatMonthlyPrice = (price: number) => `${formatPrice(price)}/mo`;

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function ReviewLineItem({
  item,
  onQuantityChange,
}: {
  item: ReviewItem;
  onQuantityChange: (item: ReviewItem, delta: number) => void;
}) {
  const isPlan = item.categoryId === CATEGORY_IDS.PLANS;
  const displayTitle = item.variantLabel ? `${item.title} — ${item.variantLabel}` : item.title;

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="size-14 shrink-0 overflow-hidden rounded-md bg-gray-200">
        {item.image ? (
          <img
            src={item.image}
            alt={displayTitle}
            className="size-full object-contain"
          />
        ) : (
          <div aria-hidden="true" className="size-full bg-gray-200" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="2xl:text-xl md:text-base text-sm font-medium text-gray-obsidian">{displayTitle}</p>
      </div>

      {isPlan ? (
        <div className="flex shrink-0 items-baseline gap-2 text-sm">
          {item.compareAtPrice !== undefined && (
            <span className="text-danger line-through">
              {formatMonthlyPrice(item.compareAtPrice)}
            </span>
          )}
          <span className="font-medium text-gray-600">
            {formatMonthlyPrice(item.unitPrice)}
          </span>
        </div>
      ) : (
        <div className="flex gap-4">
          <QuantityStepper
            variant="light"
            value={item.quantity}
            min={0}
            onIncrease={() => onQuantityChange(item, 1)}
            onDecrease={() => onQuantityChange(item, -1)}
            className="shrink-0"
          />

          <div className="flex 2xl:flex-row flex-col items-center gap-2">
            {item.compareAtPrice && (
              <span className="2xl:text-xl md:text-base text-sm font-semibold line-through text-gray-600">
                {formatPrice(item.compareAtPrice)}
              </span>
            )}

            <span className="2xl:text-xl md:text-base text-sm font-semibold text-primary">
              {formatPrice(item.unitPrice)}
            </span>
          </div>
        </div>
      )}
    </li>
  );
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

  const handleSaveForLater = () => {
    onSaveForLater();
    showFlash('Your system has been saved successfully.');
  };

  const groupedCategories = useMemo(() => {
    const itemsByCategory = snapshot.items.reduce<Record<string, ReviewItem[]>>(
      (acc, item) => {
        (acc[item.categoryId] ??= []).push(item);
        return acc;
      },
      {},
    );

    return getOrderedSteps()
      .map((step) => ({
        categoryId: step.id,
        categoryTitle: getCategoryById(step.id)?.title ?? step.title,
        items: itemsByCategory[step.id] ?? [],
      }))
      .filter((group) => group.items.length > 0);
  }, [snapshot.items]);

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
      <section className="min-w-0 flex-1">

        <div className="2xl:hidden block uppercase lg:text-sm text-xs font-semibold text-gray-600 mb-2">Review</div>
        <h2 className="font-sans-bold text-xl text-gray-obsidian">Your security system</h2>
        <p className="mt-2 text-sm text-gray-600">
          Review your personalized protection system designed to keep what matters most safe.
        </p>

        {groupedCategories.length === 0 ? (
          <p className="mt-6 text-sm text-gray-500">No items added yet.</p>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            {groupedCategories.map((group) => (
              <div key={group.categoryId}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {group.categoryTitle}
                </h3>
                <ul className="mt-1 divide-y divide-gray-300">
                  {group.items.map((item) => (
                    <ReviewLineItem
                      key={item.key}
                      item={item}
                      onQuantityChange={onQuantityChange}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex shrink-0 flex-col items-center rounded-xl bg-surface 2xl:px-4 px-0 2xl:py-6 py-0">
        <div className="flex gap-6 items-center w-full justify-between mb-1">
          <img
            src={guaranteeBadgeUrl}
            alt=""
            className="2xl:size-32 size-20 object-contain"
          />
          <div className="text-xl text-gray-obsidian">
            <div className="2xl:block hidden">
              <h3 className="mb-4 font-semibold">
                30-day hassle-free returns
              </h3>
              <p className="">
                If you&apos;re not totally in love with the product, we will refund you 100%.
              </p>
            </div>

            <div className="2xl:hidden block">
              <div className="mb-3 flex flex-col justify-end w-full items-center gap-4">
                {planItem ? (
                  <div className='text-sm font-semibold text-white bg-primary px-2 py-1 rounded-sm'>
                    as low as {formatPrice(planItem.unitPrice)}/mo
                  </div>
                ) : <span></span>}

                <div className="mb-3 flex items-baseline gap-2">
                  {hasSavings && totals.compareAtSubtotal !== undefined && (
                    <span className="text-xl font-medium text-gray-600 line-through">
                      {formatPrice(totals.compareAtSubtotal)}
                    </span>
                  )}
                  <span className="text-2xl text-primary font-bold">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 w-full items-center justify-between gap-4 2xl:flex hidden">
          {planItem ? (
            <div className='text-lg font-semibold text-white bg-primary p-2 rounded-sm'>
              as low as {formatPrice(planItem.unitPrice)}/mo
            </div>
          ) : <span></span>}

          <div className="mb-3 flex items-baseline gap-2">
            {hasSavings && totals.compareAtSubtotal !== undefined && (
              <span className="text-2xl font-medium text-gray-600 line-through">
                {formatPrice(totals.compareAtSubtotal)}
              </span>
            )}
            <span className="text-3xl text-primary font-bold">
              {formatPrice(totals.subtotal)}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'w-full space-y-1 2xl:space-y-3',
            'fixed inset-x-0 bottom-0 z-50 border-t border-gray-300 bg-surface px-4 py-3',
            'lg:static lg:z-auto lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none',
          )}
        >
          {hasSavings && (
            <div className="text-center 2xl:text-base text-sm font-semibold text-success">
              Congrats! You&apos;re saving {formatPrice(totals.savings!)} on your security bundle!
            </div>
          )}

          <Button size="lg" className="w-full" disabled={!hasItems}>
            Checkout
          </Button>

          <Button
            variant="ghost"
            className="w-full font-regular italic underline !text-gray-600"
            disabled={!hasItems}
            onClick={handleSaveForLater}
          >
            Save my system for later
          </Button>
        </div>

      </section>
    </div>
    </>
  );
}
