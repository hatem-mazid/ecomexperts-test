import { useId, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

export interface StepSectionProps {
  stepNumber: number;
  totalSteps: number;
  icon: ReactNode;
  title: string;
  selectedCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showNextButton?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={cn(
        'size-5 shrink-0 text-gray-600 transition-transform',
        isOpen && 'rotate-180',
      )}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepSection({
  stepNumber,
  totalSteps,
  icon,
  title,
  selectedCount,
  isOpen,
  onToggle,
  onNext,
  nextLabel = 'Next',
  showNextButton,
  children,
  className,
  id: idProp,
}: StepSectionProps) {
  const generatedId = useId();
  const sectionId = idProp ?? generatedId;
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;
  const shouldShowNextButton =
    showNextButton ?? (onNext !== undefined);

  return (
    <section className={cn('rounded-lg border border-gray-300 bg-gray-white', className)}>
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        )}
      >
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-600">
          Step {stepNumber} of {totalSteps}
        </span>

        <span className="shrink-0">{icon}</span>

        <span className="min-w-0 flex-1 font-sans-bold text-base text-gray-obsidian">
          {title}
        </span>

        <span
          className="shrink-0 text-sm text-gray-600"
          aria-label={`${selectedCount} selected`}
        >
          {selectedCount} selected
        </span>

        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="border-t border-gray-300 px-4 py-4"
        >
          {children}

          {shouldShowNextButton && onNext && (
            <div className="mt-4 flex justify-end">
              <Button variant="primary" onClick={onNext}>
                {nextLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
