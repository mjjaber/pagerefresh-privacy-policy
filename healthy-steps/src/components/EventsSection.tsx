import type { RefObject } from 'react';
import { siteConfig } from '../config/site.config';
import { copy } from '../content/en';
import { formatShortDate } from '../lib/datetime';
import { filterByCity, getRegistrationState, type CityFilter } from '../lib/events';
import type { CommunityEvent } from '../types/events';
import { EventCard } from './EventCard';
import { CalendarIcon, InfoIcon } from './Icons';
import { DemoBadge, StatusBadge } from './StatusBadge';

interface EventsSectionProps {
  upcoming: CommunityEvent[];
  past: CommunityEvent[];
  now: Date;
  filter: CityFilter;
  onFilterChange: (filter: CityFilter) => void;
  expandedIds: ReadonlySet<string>;
  onToggle: (eventId: string) => void;
  onVolunteer: (eventId: string) => void;
  onAskAboutFuture: () => void;
  /** False when the signup form is not configured, so the page never promises it. */
  signupAvailable: boolean;
  /** The event a shared link pointed to, when it exists. */
  linkedEventId: string | null;
  /** True when a shared link pointed to an event that does not exist. */
  linkedEventMissing: boolean;
  notFoundRef: RefObject<HTMLDivElement | null>;
}

export function EventsSection({
  upcoming,
  past,
  now,
  filter,
  onFilterChange,
  expandedIds,
  onToggle,
  onVolunteer,
  onAskAboutFuture,
  signupAvailable,
  linkedEventId,
  linkedEventMissing,
  notFoundRef,
}: EventsSectionProps) {
  const filters: { value: CityFilter; label: string }[] = [
    { value: 'all', label: copy.events.filterAll },
    ...siteConfig.serviceArea.filterCities.map((city) => ({ value: city, label: city })),
  ];

  // A shared link always reveals its event, even when the chosen filter would hide it.
  const visibleUpcoming = upcoming.filter(
    (event) => event.id === linkedEventId || filterByCity([event], filter).length > 0,
  );
  const visiblePast = past
    .filter((event) => event.id === linkedEventId || filterByCity([event], filter).length > 0)
    .slice(0, Math.max(siteConfig.pastEventsShown, 0) + (past.some((e) => e.id === linkedEventId) ? 1 : 0));
  const activeCity = filter === 'all' ? null : filter;
  const nothingAnnounced = upcoming.length === 0;

  return (
    <section id="events" aria-labelledby="events-title" className="section bg-sage/45">
      <div className="page-container">
        <p className="eyebrow">{copy.events.eyebrow}</p>
        <h2 id="events-title" className="section-title">
          {copy.events.title}
        </h2>
        <p className="lead">{copy.events.intro}</p>

        {linkedEventMissing && (
          <div
            ref={notFoundRef}
            tabIndex={-1}
            role="status"
            className="border-gold bg-gold-soft mt-8 flex items-start gap-3 rounded-2xl border-2 p-5"
          >
            <InfoIcon className="mt-1 shrink-0" />
            <div>
              <p className="font-extrabold">{copy.events.notFoundTitle}</p>
              <p className="mt-1">{copy.events.notFoundText}</p>
            </div>
          </div>
        )}

        {!nothingAnnounced && (
          <fieldset className="mt-8">
            <legend className="text-sm font-bold">{copy.events.filterLabel}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.map((option) => (
                <label
                  key={option.value}
                  className="border-teal text-teal has-checked:bg-teal has-focus-visible:outline-teal-dark inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 bg-white px-5 font-bold has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-3"
                >
                  <input
                    type="radio"
                    name="event-city-filter"
                    value={option.value}
                    checked={filter === option.value}
                    onChange={() => onFilterChange(option.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {!nothingAnnounced && (
          <p role="status" className="text-muted mt-4 text-[0.9375rem]">
            {copy.events.resultCount(visibleUpcoming.length, activeCity)}
          </p>
        )}

        {nothingAnnounced ? (
          <EmptyState
            title={copy.events.emptyAllTitle}
            text={`${copy.events.emptyAllText}${signupAvailable ? ` ${copy.events.emptyAllSignupText}` : ''}`}
            action={signupAvailable ? copy.events.emptyAllAction : undefined}
            onAction={onAskAboutFuture}
          />
        ) : visibleUpcoming.length === 0 ? (
          <EmptyState
            title={copy.events.emptyFilterTitle(activeCity ?? '')}
            text={copy.events.emptyFilterText}
            action={copy.events.emptyFilterAction}
            onAction={() => onFilterChange('all')}
          />
        ) : (
          <ul className="mt-6 space-y-6">
            {visibleUpcoming.map((event) => (
              <li key={event.id}>
                <EventCard
                  event={event}
                  registration={getRegistrationState(event, now)}
                  expanded={expandedIds.has(event.id)}
                  linked={event.id === linkedEventId}
                  onToggle={onToggle}
                  onVolunteer={onVolunteer}
                />
              </li>
            ))}
          </ul>
        )}

        {visiblePast.length > 0 && (
          <div className="mt-14">
            <h3 className="text-xl font-extrabold">{copy.events.pastTitle}</h3>
            <ul className="mt-4 space-y-4">
              {visiblePast.map((event) =>
                event.id === linkedEventId ? (
                  <li key={event.id}>
                    <EventCard
                      event={event}
                      registration={getRegistrationState(event, now)}
                      expanded={expandedIds.has(event.id)}
                      linked
                      onToggle={onToggle}
                      onVolunteer={onVolunteer}
                    />
                  </li>
                ) : (
                  <li
                    key={event.id}
                    id={`event-${event.id}`}
                    className="flex flex-col gap-2 rounded-2xl bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-bold">{event.title}</p>
                      <p className="text-muted text-[0.9375rem]">
                        {event.start ? formatShortDate(event.start) : copy.events.dateTbc} · {event.city}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge reason={getRegistrationState(event, now).reason} />
                      {event.isDemo && <DemoBadge />}
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action?: string;
  onAction: () => void;
}) {
  return (
    <div className="card mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <span className="bg-sage text-teal flex size-14 shrink-0 items-center justify-center rounded-2xl">
        <CalendarIcon width={28} height={28} />
      </span>
      <div className="flex-1">
        <h3 className="text-xl font-extrabold">{title}</h3>
        <p className="text-muted mt-1">{text}</p>
      </div>
      {action && (
        <button type="button" className="btn btn-secondary shrink-0" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
