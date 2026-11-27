import type { ComponentType, SVGProps } from 'react';
import { copy } from '../content/en';
import type { RegistrationReason } from '../lib/events';
import { CheckCircleIcon, ClockIcon, CloseCircleIcon, LockIcon } from './Icons';

/**
 * Event status shown as an icon plus words, never by color alone.
 */
const styles: Record<RegistrationReason, { className: string; icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  open: { className: 'bg-sage text-teal-dark', icon: CheckCircleIcon },
  closed: { className: 'bg-gold-soft text-charcoal', icon: LockIcon },
  'deadline-passed': { className: 'bg-gold-soft text-charcoal', icon: ClockIcon },
  'no-roles': { className: 'bg-gold-soft text-charcoal', icon: ClockIcon },
  cancelled: { className: 'bg-danger-soft text-danger', icon: CloseCircleIcon },
  completed: { className: 'bg-warm-white text-muted border border-line', icon: CheckCircleIcon },
  draft: { className: 'bg-warm-white text-muted border border-line', icon: ClockIcon },
};

export function StatusBadge({ reason }: { reason: RegistrationReason }) {
  const { className, icon: StatusIcon } = styles[reason];
  return (
    <span className={`badge ${className}`}>
      <StatusIcon width={16} height={16} />
      {copy.events.status[reason]}
    </span>
  );
}

export function DemoBadge() {
  return <span className="badge bg-charcoal text-white">{copy.events.demoBadge}</span>;
}
