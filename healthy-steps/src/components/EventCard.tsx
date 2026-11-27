import { useState } from 'react';
import { copy } from '../content/en';
import { getRoles } from '../data/roles';
import { formatLongDate, formatShortDate, formatTime, formatTimeRange, getDateTileParts } from '../lib/datetime';
import type { RegistrationState } from '../lib/events';
import { buildEventLink, buildMapLink } from '../lib/links';
import type { CommunityEvent } from '../types/events';
import { AlertIcon, CalendarIcon, ChevronDownIcon, ClockIcon, ExternalLinkIcon, InfoIcon, LinkIcon, MapPinIcon } from './Icons';
import { DemoBadge, StatusBadge } from './StatusBadge';

interface EventCardProps {
  event: CommunityEvent;
  registration: RegistrationState;
  expanded: boolean;
  /** True when the visitor arrived through a shared link to this event. */
  linked?: boolean;
  onToggle: (eventId: string) => void;
  onVolunteer: (eventId: string) => void;
}

/** DOM ids, shared with the code that scrolls to and focuses an event. */
export const eventCardId = (eventId: string) => `event-${eventId}`;
export const eventTitleId = (eventId: string) => `event-${eventId}-title`;

export function EventCard({ event, registration, expanded, linked, onToggle, onVolunteer }: EventCardProps) {
  const detailsId = `event-${event.id}-details`;
  const roles = getRoles(event.volunteerRoleIds);
  const tile = event.start ? getDateTileParts(event.start) : null;
  const isCancelled = registration.reason === 'cancelled';
  const closedExplanation = copy.events.closedExplanation[registration.reason];

  return (
    <article
      id={eventCardId(event.id)}
      aria-labelledby={eventTitleId(event.id)}
      className={`card border-2 ${linked ? 'border-teal' : 'border-transparent'}`}
    >
      {linked && (
        <p className="text-teal mb-4 flex items-center gap-2 text-sm font-bold">
          <LinkIcon width={16} height={16} />
          {copy.events.linkedNotice}
        </p>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div
          className={`flex w-20 shrink-0 flex-col items-center rounded-2xl py-2 text-center ${isCancelled ? 'bg-danger-soft' : 'bg-sage'}`}
          aria-hidden="true"
        >
          {tile ? (
            <>
              <span className="text-teal-dark text-xs font-extrabold tracking-widest uppercase">{tile.month}</span>
              <span className={`text-3xl leading-none font-extrabold ${isCancelled ? 'line-through decoration-2' : ''}`}>
                {tile.day}
              </span>
              <span className="text-muted text-xs font-bold">{tile.weekday}</span>
            </>
          ) : (
            <span className="text-muted px-1 py-3 text-xs font-bold uppercase">TBC</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge reason={registration.reason} />
            {event.isDemo && <DemoBadge />}
          </div>

          <h3 id={eventTitleId(event.id)} tabIndex={-1} className="mt-3 text-2xl font-extrabold">
            {event.title}
          </h3>

          <ul className="text-charcoal mt-3 space-y-1.5 font-semibold">
            <li className="flex items-start gap-2.5">
              <CalendarIcon className="text-teal mt-1 shrink-0" />
              <span>{event.start ? formatLongDate(event.start) : copy.events.dateTbc}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <ClockIcon className="text-teal mt-1 shrink-0" />
              <span>{event.start ? formatTimeRange(event.start, event.end) : copy.events.timeTbc}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="text-teal mt-1 shrink-0" />
              <span>{event.city}</span>
            </li>
          </ul>

          <p className="text-muted mt-4">{event.summary}</p>

          {isCancelled && (
            <div className="bg-danger-soft text-charcoal mt-4 flex items-start gap-3 rounded-2xl p-4">
              <AlertIcon className="text-danger mt-0.5 shrink-0" />
              <div>
                <p className="text-danger font-bold">{copy.events.cancelledNotice}</p>
                {event.cancellationNote && <p className="mt-1">{event.cancellationNote}</p>}
                <p className="mt-1">{copy.events.cancelledFollowUp}</p>
              </div>
            </div>
          )}

          {event.isDemo && (
            <p className="bg-warm-white border-line text-charcoal mt-4 flex items-start gap-3 rounded-2xl border border-dashed p-4 text-[0.9375rem]">
              <InfoIcon className="mt-0.5 shrink-0" />
              {copy.events.demoNotice}
            </p>
          )}

          {registration.isOpen && roles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-bold">{copy.events.volunteerNeeds}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <li key={role.id} className="border-sage-dark bg-warm-white rounded-full border px-3 py-1 text-sm font-semibold">
                    {role.label}
                  </li>
                ))}
              </ul>
              {event.registrationDeadline && (
                <p className="text-muted mt-3 text-[0.9375rem]">
                  {copy.events.signupDeadline(
                    `${formatShortDate(event.registrationDeadline)}, ${formatTime(event.registrationDeadline)}`,
                  )}
                </p>
              )}
            </div>
          )}

          {!registration.isOpen && !isCancelled && closedExplanation && (
            <p className="text-muted mt-4 text-[0.9375rem] font-semibold">{closedExplanation}</p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {registration.isOpen && (
              <button type="button" className="btn btn-primary" onClick={() => onVolunteer(event.id)}>
                {copy.events.volunteerAction}
                <span className="sr-only">: {event.title}</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => onToggle(event.id)}
            >
              {expanded ? copy.events.hideDetails : copy.events.showDetails}
              <span className="sr-only"> {copy.events.detailsFor(event.title)}</span>
              <ChevronDownIcon className={`transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div id={detailsId} hidden={!expanded} className="border-sage-dark mt-8 border-t pt-8">
        {expanded && <EventDetails event={event} registration={registration} />}
      </div>
    </article>
  );
}

function EventDetails({ event, registration }: { event: CommunityEvent; registration: RegistrationState }) {
  const roles = getRoles(event.volunteerRoleIds);
  const policies = [
    { label: copy.events.admission, value: event.admission },
    { label: copy.events.ageGuidance, value: event.ageGuidance },
    { label: copy.events.accessibility, value: event.accessibility },
  ].flatMap((item) => (item.value?.trim() ? [{ label: item.label, value: item.value }] : []));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-8">
        <section>
          <h4 className="text-lg font-extrabold">{copy.events.where}</h4>
          <p className="mt-2 font-semibold">{event.venue ?? copy.events.venueTbc}</p>
          <p className="text-muted">{event.address ?? event.city}</p>
          {event.address && !event.isDemo && (
            <a
              className="text-link mt-2 inline-flex min-h-11 items-center gap-1.5"
              href={buildMapLink(event.venue, event.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.events.mapLink}
              <ExternalLinkIcon width={16} height={16} />
              <span className="sr-only">{copy.externalLinkNote}</span>
            </a>
          )}
        </section>

        <section>
          <h4 className="text-lg font-extrabold">{copy.events.aboutEvent}</h4>
          <div className="mt-2 space-y-3">
            {event.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {event.plannedActivities.length > 0 && (
          <section>
            <h4 className="text-lg font-extrabold">{copy.events.activities}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {event.plannedActivities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </section>
        )}

        {policies.length > 0 && (
          <section>
            <h4 className="text-lg font-extrabold">{copy.events.goodToKnow}</h4>
            <dl className="mt-2 space-y-2">
              {policies.map((policy) => (
                <div key={policy.label}>
                  <dt className="font-bold">{policy.label}</dt>
                  <dd className="text-muted">{policy.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      <div className="space-y-8">
        {roles.length > 0 && (
          <section>
            <h4 className="text-lg font-extrabold">{copy.events.rolesAvailable}</h4>
            <ul className="mt-2 space-y-3">
              {roles.map((role) => (
                <li key={role.id}>
                  <p className="font-bold">{role.label}</p>
                  <p className="text-muted text-[0.9375rem]">{role.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {event.shifts.length > 0 && (
          <section>
            <h4 className="text-lg font-extrabold">{copy.events.shiftsAvailable}</h4>
            <ul className="mt-2 space-y-2">
              {event.shifts.map((shift) => (
                <li key={shift.id} className="flex flex-wrap justify-between gap-x-4">
                  <span className="font-bold">{shift.label}</span>
                  <span className="text-muted">{formatTimeRange(shift.start, shift.end)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {event.volunteerExpectations.length > 0 && (
          <section>
            <h4 className="text-lg font-extrabold">{copy.events.expectations}</h4>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {event.volunteerExpectations.map((expectation) => (
                <li key={expectation}>{expectation}</li>
              ))}
            </ul>
          </section>
        )}

        {registration.isOpen && (
          <p className="bg-warm-white text-muted flex items-start gap-3 rounded-2xl p-4 text-[0.9375rem]">
            <InfoIcon className="mt-0.5 shrink-0" />
            {copy.events.capacityNote}
          </p>
        )}

        <ShareLink eventId={event.id} />
      </div>
    </div>
  );
}

function ShareLink({ eventId }: { eventId: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const link = buildEventLink(eventId, window.location.href);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setState('copied');
    } catch {
      // Clipboard access can be unavailable; show the link to copy by hand.
      setState('manual');
    }
  };

  return (
    <div>
      <button type="button" className="btn-quiet -ml-4 inline-flex cursor-pointer items-center gap-2" onClick={copyLink}>
        <LinkIcon width={18} height={18} />
        {copy.events.copyLink}
      </button>
      <p role="status" className="text-muted text-[0.9375rem]">
        {state === 'copied' && copy.events.linkCopied}
        {state === 'manual' && (
          <>
            {copy.events.linkCopyFallback} <span className="font-semibold break-all select-all">{link}</span>
          </>
        )}
      </p>
    </div>
  );
}
