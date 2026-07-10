import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { CATEGORY_IDS } from '@/constants/categories';
import type { ReviewItem } from '@/types/review';

import { formatMonthlyPrice, formatPrice } from '@/utils';

export interface ReviewLineItemProps {
  item: ReviewItem;
  onQuantityChange: (item: ReviewItem, delta: number) => void;
}

export function ReviewLineItem({ item, onQuantityChange }: ReviewLineItemProps) {
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
        <div className="flex shrink-0 items-baseline gap-2 md:text-base text-sm">
          {item.compareAtPrice !== undefined && (
            <span className="text-gray-600 line-through">
              {formatMonthlyPrice(item.compareAtPrice)}
            </span>
          )}
          <span className="text-primary font-semibold">
            {item.unitPrice === 0 ? 'Free' : formatMonthlyPrice(item.unitPrice)}
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
                {formatPrice(item.compareAtPrice * item.quantity || 0)}
              </span>
            )}

            <span className="2xl:text-xl md:text-base text-sm font-semibold text-primary">
              {formatPrice(item.unitPrice * item.quantity || 0)}
            </span>
          </div>
        </div>
      )}
    </li>
  );
}
