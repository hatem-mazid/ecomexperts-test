import type { Product, Step, VariantId } from '@/types';
import { getVariant, resolveProductImage } from '@/domain';

const stepIcons = import.meta.glob<string>('../../assets/icons/*.svg', {
  eager: true,
  import: 'default',
});

const assetImages = import.meta.glob<string>(
  '../../assets/**/*.{png,svg,jpg,jpeg,webp}',
  {
    eager: true,
    import: 'default',
  },
);

const VARIANT_IMAGE_FILES: Record<string, string> = {
  white: 'white.png',
  gray: 'gray.png',
  black: 'black.png',
  standard: 'image 112.png',
  'with solar panel': 'image 113.png',
};

function resolveStepIcon(iconPath: string): string {
  const filename = iconPath.split('/').pop() ?? iconPath;
  const key = `../../assets/icons/${filename}`;
  return stepIcons[key] ?? iconPath;
}

function getAssetUrl(path: string): string | undefined {
  const key = `../../assets/${path}`;
  return assetImages[key];
}

export function withResolvedStepIcons(steps: readonly Step[]): Step[] {
  return steps.map((step) => ({
    ...step,
    icon: resolveStepIcon(step.icon),
  }));
}

export function resolveProductImageUrl(
  product: Product,
  variantId?: VariantId,
): string | undefined {
  const catalogImagePath = resolveProductImage(product, variantId);

  if (!catalogImagePath) {
    return undefined;
  }

  if (catalogImagePath.startsWith('/images/data/')) {
    return getAssetUrl(
      `images/data/${catalogImagePath.slice('/images/data/'.length)}`,
    );
  }

  if (catalogImagePath.startsWith('/icons/')) {
    return getAssetUrl(`icons/${catalogImagePath.slice('/icons/'.length)}`);
  }

  const productFolder = `images/data/products/${product.title}`;

  if (variantId) {
    const variant = getVariant(product, variantId);
    const file = variant
      ? VARIANT_IMAGE_FILES[variant.label.toLowerCase()]
      : undefined;

    if (file) {
      return getAssetUrl(`${productFolder}/${file}`);
    }
  }

  if (product.categoryId === 'cameras') {
    return getAssetUrl(`${productFolder}/${product.title}.png`);
  }

  if (product.categoryId === 'sensors') {
    return getAssetUrl(`images/data/sensors/${product.title}.png`);
  }

  return undefined;
}
