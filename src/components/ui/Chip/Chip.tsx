export interface ChipProps {
  label: string;
  image?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Chip({
  label,
  image,
  selected = false,
  onClick,
  disabled = false,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-success bg-success-50'
          : 'border-gray-300 bg-gray-white hover:border-gray-400',
        className,
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="size-6 shrink-0 rounded object-cover"
        />
      )}
      <span>{label}</span>
    </button>
  );
}
