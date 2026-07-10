import { useId, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';

export interface AccordionItemProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  icon: string;
  iconAlt?: string;
  selectedCount?: number;
  nextButtonText?: string;
  onNext?: () => void;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  id?: string;
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}


export function AccordionItem({
  stepNumber,
  totalSteps,
  title,
  icon,
  iconAlt = '',
  selectedCount = 0,
  nextButtonText,
  onNext,
  isOpen,
  onToggle,
  children,
  className,
  id: idProp,
}: AccordionItemProps) {
  const generatedId = useId();
  const sectionId = idProp ?? generatedId;
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;

  return (
    <section className={cn('bg-gray-white md:rounded-xl', isOpen && 'bg-surface', className)}>
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          'flex w-full flex-col gap-2 md:px-4 px-0pt-3 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        )}
      >
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 md:px-0 px-4">
            Step {stepNumber} of {totalSteps}
          </span>

        <span
          className={cn(
            "flex w-full items-center gap-3 border-t border-gray-600 px-4 py-5",
            !isOpen && 'border-b '
          )}
        >
          <img src={icon} alt={iconAlt} className="size-6 shrink-0 object-contain" />

          <span className="min-w-0 flex-1 font-sans-bold 2xl:text-3xl md:text-2xl text-xl text-gray-obsidian">
            {title}
          </span>

          <div className="flex gap-1 items-center">
            {selectedCount > 0 && (
              <span className="text-sm leading-none font-semibold text-primary">
                {selectedCount} selected
              </span>
            )}

            <svg className={cn('size-3 shrink-0 text-gray-600 transition-transform', isOpen && 'rotate-180')} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.40682 9.43039C6.20741 9.70956 5.7925 9.70956 5.59309 9.43038L1.56472 3.79062C1.32834 3.45968 1.5649 3 1.97159 3L10.0284 3C10.4351 3 10.6716 3.45969 10.4353 3.79062L6.40682 9.43039Z" fill="#4E2FD2"/>
            </svg>
          </div>

        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        aria-hidden={!isOpen}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">
            {children}

            {nextButtonText && onNext && (
              <div className="mt-6 flex justify-center">
                <Button variant="outline" size="lg" onClick={onNext}>
                  {nextButtonText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
