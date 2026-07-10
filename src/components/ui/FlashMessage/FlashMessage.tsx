export type FlashMessageVariant = 'success' | 'error' | 'info';

export interface FlashMessageProps {
  message: string | null;
  variant?: FlashMessageVariant;
  className?: string;
}

const variantClasses: Record<FlashMessageVariant, string> = {
  success: 'bg-success text-gray-white',
  error: 'bg-danger text-gray-white',
  info: 'bg-primary text-gray-white',
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function FlashMessage({
  message,
  variant = 'success',
  className,
}: FlashMessageProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed top-4 left-1/2 z-60 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium shadow-lg',
        variantClasses[variant],
        className,
      )}
    >
      {message}
    </div>
  );
}
