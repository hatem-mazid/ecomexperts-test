import type { ReactNode } from 'react';

import { AccordionItem } from './AccordionItem';

export interface AccordionStep {
  id: string;
  title: string;
  icon: string;
  order: number;
  nextButtonText: string;
}

export interface AccordionProps {
  steps: readonly AccordionStep[];
  openStepId: string;
  onStepToggle: (stepId: string) => void;
  onNextStep: (stepId: string) => void;
  renderPanel: (step: AccordionStep) => ReactNode;
  getSelectedCount?: (step: AccordionStep) => number;
  className?: string;
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Accordion({
  steps,
  openStepId,
  onStepToggle,
  onNextStep,
  renderPanel,
  getSelectedCount,
  className,
}: AccordionProps) {
  const totalSteps = steps.length;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {steps.map((step) => (
        <AccordionItem
          key={step.id}
          id={`accordion-${step.id}`}
          stepNumber={step.order}
          totalSteps={totalSteps}
          title={step.title}
          icon={step.icon}
          iconAlt={step.title}
          selectedCount={getSelectedCount?.(step)}
          nextButtonText={step.nextButtonText}
          onNext={() => onNextStep(step.id)}
          isOpen={openStepId === step.id}
          onToggle={() => onStepToggle(step.id)}
        >
          {renderPanel(step)}
        </AccordionItem>
      ))}
    </div>
  );
}

export { AccordionItem } from './AccordionItem';
export type { AccordionItemProps } from './AccordionItem';
