import type { BadgeVariant } from '@/components/ui/Badge';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

export interface ProductCardBadge {
  label: string;
  variant?: BadgeVariant;
}

export interface ProductCardVariant {
  id: string | number;
  label: string;
  image?: string;
  selected?: boolean;
  onSelect?: () => void;
}

export interface ProductCardProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  currentPrice: string;
  compareAtPrice?: string;
  badge?: ProductCardBadge;
  learnMoreUrl?: string;
  learnMoreLabel?: string;
  variants?: readonly ProductCardVariant[];
  quantity: number;
  quantityMin?: number;
  quantityMax?: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
  isSelected?: boolean;
  className?: string;
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function ProductCard({
  title,
  description,
  image,
  imageAlt,
  currentPrice,
  compareAtPrice,
  badge,
  learnMoreUrl,
  learnMoreLabel = 'Learn More',
  variants,
  quantity,
  quantityMin,
  quantityMax,
  onQuantityIncrease,
  onQuantityDecrease,
  isSelected = false,
  className,
}: ProductCardProps) {
  const hasVariants = variants !== undefined && variants.length > 0;

  return (
    <div
      className={cn(
        'rounded-xl bg-gray-white px-3 py-4 @container grid place-content-center transition-[outline-color]',
        isSelected && 'outline outline-2 outline-primary/70',
        className,
      )}
    >
      <div className="">
        <div className="flex gap-4 @[380px]:flex-row flex-col">
          <div className="relative shrink-0">
            {badge && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            )}
            {image ? (
              <img
                src={image}
                alt={imageAlt ?? title}
                className="w-full max-h-40 object-contain"
              />
            ) : (
              <div
                aria-hidden="true"
                className="size-24 rounded-md bg-gray-200"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xl text-gray-obsidian">{title}</h3>
            <p className="mt-1 font-medium md:text-base text-sm text-gray-600">
              {description}
              <a
                href={learnMoreUrl}
                className="ms-2 text-info underline  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {learnMoreLabel}
              </a>
            </p>
          </div>
        </div>

        {hasVariants && (
          <div
            role="group"
            aria-label="Product variants"
            className="mt-4 flex flex-wrap gap-2"
          >
            {variants.map((variant) => (
              <Chip
                key={variant.id}
                label={variant.label}
                image={variant.image}
                selected={variant.selected}
                onClick={variant.onSelect}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <QuantityStepper
            value={quantity}
            min={quantityMin}
            max={quantityMax}
            onIncrease={onQuantityIncrease}
            onDecrease={onQuantityDecrease}
          />


          <div className="flex items-baseline gap-2 text-lg font-normal">
            {compareAtPrice && (
              <span className="text-danger line-through">{compareAtPrice}</span>
            )}
            <span className="text-gray-500">
              {currentPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
