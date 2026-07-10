import { Button } from '@/components/ui/Button';
import type { ReviewItem, ReviewTotals } from '@/types/review';
import guaranteeBadgeUrl from '@assets/images/others/guarantee-badge.png';

import { cn, formatPrice } from '@/utils';

export interface ReviewSummarySectionProps {
  planItem?: ReviewItem;
  totals: ReviewTotals;
  hasItems: boolean;
  hasSavings: boolean;
  onSaveForLater: () => void;
}

export function ReviewSummarySection({
  planItem,
  totals,
  hasItems,
  hasSavings,
  onSaveForLater,
}: ReviewSummarySectionProps) {
  return (
    <section className="flex shrink-0 flex-col items-center rounded-xl bg-surface 2xl:px-4 px-0 2xl:py-6 py-0">
      <div className="flex gap-6 items-center w-full justify-between mb-1">
        <img
          src={guaranteeBadgeUrl}
          alt=""
          className="2xl:size-32 size-20 object-contain"
        />
        <div className="text-xl text-gray-obsidian">
          <div className="2xl:block hidden">
            <h3 className="mb-4 font-semibold">30-day hassle-free returns</h3>
            <p className="">
              If you&apos;re not totally in love with the product, we will refund you 100%.
            </p>
          </div>

          <div className="2xl:hidden block">
            <div className="mb-3 flex flex-col justify-end w-full items-center gap-4">
              {planItem ? (
                <div className="text-sm font-semibold text-white bg-primary px-2 py-1 rounded-sm">
                  as low as {formatPrice(planItem.unitPrice)}/mo
                </div>
              ) : (
                <span></span>
              )}

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
          <div className="text-lg font-semibold text-white bg-primary p-2 rounded-sm">
            as low as {formatPrice(planItem.unitPrice)}/mo
          </div>
        ) : (
          <span></span>
        )}

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
          onClick={onSaveForLater}
        >
          Save my system for later
        </Button>
      </div>
    </section>
  );
}
