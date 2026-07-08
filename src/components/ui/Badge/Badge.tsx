import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'promo' | 'success' | 'neutral';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary text-gray-white',
  promo: 'bg-success-50 text-success',
  success: 'bg-success text-gray-white',
  neutral: 'bg-gray-200 text-gray-700',
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
