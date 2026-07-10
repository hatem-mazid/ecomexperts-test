import { CATEGORY_IDS } from '@/constants/categories';
import { getCategoryById, getOrderedSteps } from '@/data';
import type { ReviewItem } from '@/types/review';

export interface ReviewCategoryGroup {
  categoryId: string;
  categoryTitle: string;
  items: ReviewItem[];
}

export function groupReviewItems(items: ReviewItem[]): ReviewCategoryGroup[] {
  const itemsByCategory = items.reduce<Record<string, ReviewItem[]>>((acc, item) => {
    (acc[item.categoryId] ??= []).push(item);
    return acc;
  }, {});

  const groups = getOrderedSteps()
    .map((step) => ({
      categoryId: step.id,
      categoryTitle: getCategoryById(step.id)?.title ?? step.title,
      items: itemsByCategory[step.id] ?? [],
    }))
    .filter((group) => group.items.length > 0);

  const planGroup = groups.find((group) => group.categoryId === CATEGORY_IDS.PLANS);
  const otherGroups = groups.filter((group) => group.categoryId !== CATEGORY_IDS.PLANS);

  if (!planGroup) {
    return otherGroups;
  }

  return [...otherGroups, planGroup];
}
