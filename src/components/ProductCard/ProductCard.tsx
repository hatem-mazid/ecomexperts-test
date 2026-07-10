import type { KeyboardEvent } from 'react';
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

interface ProductCardBaseProps {
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
  className?: string;
}

export type ProductCardProps = ProductCardBaseProps &
  (
    | {
        selectionMode?: 'multiple';
        quantity: number;
        quantityMin?: number;
        quantityMax?: number;
        onQuantityIncrease: () => void;
        onQuantityDecrease: () => void;
        isSelected?: boolean;
      }
    | {
        selectionMode: 'single';
        selected: boolean;
        onSelect: () => void;
      }
  );

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const imageWrapperClassName = 'relative w-full shrink-0 @[380px]:w-40';
const imageClassName = 'h-40 w-full shrink-0 @[380px]:w-40 object-contain';
const placeholderClassName =
  'flex h-40 w-full shrink-0 items-center justify-center rounded-md bg-gray-200 @[380px]:w-40';

function GalleryIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-10 text-gray-500"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path
        d="M21 15l-5-5L5 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProductImagePlaceholder() {
  return (
    <div aria-hidden="true" className={placeholderClassName}>
      <GalleryIcon />
    </div>
  );
}

export function ProductCard(props: ProductCardProps) {
  const {
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
    className,
  } = props;

  const isSingle = props.selectionMode === 'single';
  const isSelected = isSingle ? props.selected : (props.isSelected ?? false);
  const hasVariants = variants !== undefined && variants.length > 0;

  function handleKeyDown(event: KeyboardEvent) {
    if (!isSingle) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      props.onSelect();
    }
  }

  return (
    <div
      role={isSingle ? 'radio' : undefined}
      aria-checked={isSingle ? isSelected : undefined}
      tabIndex={isSingle ? 0 : undefined}
      onClick={isSingle ? props.onSelect : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-xl bg-gray-white px-3 py-4 @container grid place-content-center transition-[outline-color]',
        isSelected && 'outline outline-2 outline-primary/70',
        isSingle && 'cursor-pointer',
        className,
      )}
    >
      <div>
        <div className="flex gap-4 @[380px]:flex-row flex-col">
          <div className={imageWrapperClassName}>
            {badge && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
            )}
            {image ? (
              <img
                src={image}
                alt={imageAlt ?? title}
                className={imageClassName}
              />
            ) : (
              <ProductImagePlaceholder />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xl text-gray-obsidian">{title}</h3>
            <p className="mt-1 font-medium md:text-base text-sm text-gray-600">
              {description}
              {learnMoreUrl && (
                <a
                  href={learnMoreUrl}
                  onClick={(event) => event.stopPropagation()}
                  className="ms-2 text-info underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {learnMoreLabel}
                </a>
              )}
            </p>
          </div>
        </div>

        {hasVariants && (
          <div
            role="group"
            aria-label="Product variants"
            className="mt-4 flex flex-wrap gap-2"
            onClick={(event) => event.stopPropagation()}
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

        <div
          className={cn(
            'mt-4 flex items-center gap-4',
            isSingle ? 'justify-end' : 'justify-between',
          )}
        >
          {!isSingle && (
            <QuantityStepper
              value={props.quantity}
              min={props.quantityMin}
              max={props.quantityMax}
              onIncrease={props.onQuantityIncrease}
              onDecrease={props.onQuantityDecrease}
            />
          )}

          <div className="flex items-baseline gap-2 text-lg font-normal">
            {compareAtPrice && (
              <span className="text-danger line-through">{compareAtPrice}</span>
            )}
            <span className="text-gray-500">{currentPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
