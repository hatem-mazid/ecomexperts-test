/** Canonical identifiers for bundle builder categories / wizard steps. */
export const CATEGORY_IDS = {
  CAMERAS: 'cameras',
  PLANS: 'plans',
  SENSORS: 'sensors',
  EXTRA_PROTECTION: 'extra-protection',
} as const;

export type CategoryId = (typeof CATEGORY_IDS)[keyof typeof CATEGORY_IDS];
