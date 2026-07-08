export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  className?: string;
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function QuantityStepper({
  value,
  min = 0,
  max,
  onIncrease,
  onDecrease,
  disabled = false,
  className,
}: QuantityStepperProps) {
  const isDecreaseDisabled = disabled || value <= min;
  const isIncreaseDisabled =
    disabled || (max !== undefined && value >= max);

  const buttonClassName = cn(
    'inline-flex size-8 items-center justify-center text-lg font-medium text-gray-700 transition-colors',
    'hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
    'disabled:cursor-not-allowed disabled:bg-white disabled:border-2 disabled:border-gray-300 disabled:hover:bg-transparent',
  );

  return (
    <div
      role="group"
      aria-label="Quantity"
      className={cn(
        'inline-flex items-center overflow-hidden',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={isDecreaseDisabled}
        onClick={onDecrease}
        className={cn(buttonClassName, 'border-gray-300 bg-gray-200 rounded-sm')}
      >
        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2214_545)">
          <path d="M7.33333 5.6H0.666667C0.489856 5.6 0.320286 5.51571 0.195262 5.36569C0.0702379 5.21566 0 5.01217 0 4.8C0 4.58783 0.0702379 4.38434 0.195262 4.23431C0.320286 4.08429 0.489856 4 0.666667 4H7.33333C7.51014 4 7.67971 4.08429 7.80474 4.23431C7.92976 4.38434 8 4.58783 8 4.8C8 5.01217 7.92976 5.21566 7.80474 5.36569C7.67971 5.51571 7.51014 5.6 7.33333 5.6Z" fill="#525963"/>
          </g>
          <defs>
          <clipPath id="clip0_2214_545">
          <rect width="8" height="9.6" fill="white"/>
          </clipPath>
          </defs>
        </svg>

      </button>
      <span
        aria-live="polite"
        className="min-w-8 px-2 text-center text-base font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={isIncreaseDisabled}
        onClick={onIncrease}
        className={cn(buttonClassName, 'border-gray-300 bg-gray-200 rounded-sm')}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.33333 3.33333H4.66667V0.666667C4.66667 0.489856 4.59643 0.320286 4.4714 0.195262C4.34638 0.0702379 4.17681 0 4 0C3.82319 0 3.65362 0.0702379 3.5286 0.195262C3.40357 0.320286 3.33333 0.489856 3.33333 0.666667V3.33333H0.666667C0.489856 3.33333 0.320286 3.40357 0.195262 3.5286C0.0702379 3.65362 0 3.82319 0 4C0 4.17681 0.0702379 4.34638 0.195262 4.4714C0.320286 4.59643 0.489856 4.66667 0.666667 4.66667H3.33333V7.33333C3.33333 7.51014 3.40357 7.67971 3.5286 7.80474C3.65362 7.92976 3.82319 8 4 8C4.17681 8 4.34638 7.92976 4.4714 7.80474C4.59643 7.67971 4.66667 7.51014 4.66667 7.33333V4.66667H7.33333C7.51014 4.66667 7.67971 4.59643 7.80474 4.4714C7.92976 4.34638 8 4.17681 8 4C8 3.82319 7.92976 3.65362 7.80474 3.5286C7.67971 3.40357 7.51014 3.33333 7.33333 3.33333Z" fill="#525963"/>
        </svg>

      </button>
    </div>
  );
}
