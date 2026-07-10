import type { ReviewCategoryGroup } from '@/domain';
import type { ReviewItem } from '@/types/review';
import { ReviewLineItem } from './ReviewLineItem';

export interface ReviewItemsSectionProps {
  groupedCategories: ReviewCategoryGroup[];
  onQuantityChange: (item: ReviewItem, delta: number) => void;
}

export function ReviewItemsSection({
  groupedCategories,
  onQuantityChange,
}: ReviewItemsSectionProps) {
  return (
    <section className="min-w-0 flex-1">
      <div className="2xl:hidden block uppercase lg:text-sm text-xs font-semibold text-gray-600 mb-2">
        Review
      </div>
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
  );
}
