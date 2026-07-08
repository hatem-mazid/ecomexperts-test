import { createInitialBundleState } from '@/domain';
import type { BundleState } from '@/types';
import { categories, steps } from '@/data';

/** Default bundle state for Zustand store initialization. */
export function getInitialBundleState(): BundleState {
  return createInitialBundleState(
    categories.map((category) => category.id),
    steps[0]?.id ?? 'cameras',
  );
}
