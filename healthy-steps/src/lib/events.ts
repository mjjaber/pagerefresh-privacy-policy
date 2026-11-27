import { getRole } from '../data/roles';
import type { CommunityEvent } from '../types/events';
import { isIsoWithOffset } from './datetime';

/**
 * Why an event is or is not accepting volunteer requests right now.
 * The interface uses this for both the status badge and the form.
 */
export type RegistrationReason =
  | 'open'
  | 'closed'
  | 'deadline-passed'
  | 'cancelled'
  | 'completed'
  | 'draft'
  | 'no-roles';

export interface RegistrationState {
  isOpen: boolean;
  reason: RegistrationReason;
}

const time = (iso: string | undefined): number | undefined => (iso ? Date.parse(iso) : undefined);

/** Draft events are never shown publicly. */
export function isPublic(event: CommunityEvent): boolean {
  return event.publicationStatus !== 'draft';
}

/** An event is over once its end time (or start time, if no end) has passed. */
export function hasEnded(event: CommunityEvent, now: Date): boolean {
  if (event.publicationStatus === 'completed') return true;
  const finish = time(event.end) ?? time(event.start);
  return finish !== undefined && finish <= now.getTime();
}

export function getRegistrationState(event: CommunityEvent, now: Date): RegistrationState {
  const closed = (reason: RegistrationReason): RegistrationState => ({ isOpen: false, reason });

  if (event.publicationStatus === 'draft') return closed('draft');
  if (event.publicationStatus === 'cancelled') return closed('cancelled');
  if (hasEnded(event, now)) return closed('completed');
  if (event.registrationStatus === 'closed') return closed('closed');
  const deadline = time(event.registrationDeadline);
  if (deadline !== undefined && deadline <= now.getTime()) return closed('deadline-passed');
  if (event.volunteerRoleIds.length === 0) return closed('no-roles');
  return { isOpen: true, reason: 'open' };
}

/** Events a volunteer can currently request, soonest first. */
export function getOpenEvents(events: readonly CommunityEvent[], now: Date): CommunityEvent[] {
  return sortByStart(events.filter((event) => getRegistrationState(event, now).isOpen));
}

/** Soonest first; events without a confirmed date go last. */
export function sortByStart(events: readonly CommunityEvent[]): CommunityEvent[] {
  return [...events].sort((a, b) => {
    const aTime = time(a.start) ?? Number.POSITIVE_INFINITY;
    const bTime = time(b.start) ?? Number.POSITIVE_INFINITY;
    return aTime - bTime || a.title.localeCompare(b.title);
  });
}

/**
 * Splits public events into upcoming (soonest first, including cancelled
 * events whose date has not passed, so volunteers still see the notice)
 * and past (most recent first).
 */
export function partitionEvents(
  events: readonly CommunityEvent[],
  now: Date,
): { upcoming: CommunityEvent[]; past: CommunityEvent[] } {
  const visible = events.filter(isPublic);
  const upcoming = sortByStart(visible.filter((event) => !hasEnded(event, now)));
  const past = sortByStart(visible.filter((event) => hasEnded(event, now))).reverse();
  return { upcoming, past };
}

export type CityFilter = 'all' | string;

export function filterByCity(events: readonly CommunityEvent[], filter: CityFilter): CommunityEvent[] {
  if (filter === 'all') return [...events];
  return events.filter((event) => event.city.toLowerCase() === filter.toLowerCase());
}

/** Finds a public event by ID. Drafts are treated as not found. */
export function findPublicEvent(events: readonly CommunityEvent[], id: string): CommunityEvent | undefined {
  return events.find((event) => event.id === id && isPublic(event));
}

/**
 * Checks event data for mistakes that are easy to make when editing by
 * hand. Returns a list of plain-language problems (empty when all is well).
 * `npm test` runs this against src/data/events.ts.
 */
export function validateEvents(events: readonly CommunityEvent[]): string[] {
  const problems: string[] = [];
  const seenIds = new Set<string>();
  const idPattern = /^[a-z0-9][a-z0-9-]*$/;

  const checkTime = (eventId: string, field: string, value: string | undefined) => {
    if (value !== undefined && !isIsoWithOffset(value)) {
      problems.push(
        `${eventId}: "${field}" must be a full timestamp with a UTC offset, like 2027-03-13T09:00:00-08:00 (found "${value}").`,
      );
    }
  };

  for (const event of events) {
    const label = event.id || '(event without id)';
    if (!idPattern.test(event.id)) {
      problems.push(`${label}: "id" may only contain lowercase letters, numbers, and hyphens.`);
    }
    if (seenIds.has(event.id)) problems.push(`${label}: this event id is used more than once.`);
    seenIds.add(event.id);

    if (!event.title.trim()) problems.push(`${label}: "title" is empty.`);
    if (!event.city.trim()) problems.push(`${label}: "city" is empty.`);
    if (!event.summary.trim()) problems.push(`${label}: "summary" is empty.`);

    checkTime(label, 'start', event.start);
    checkTime(label, 'end', event.end);
    checkTime(label, 'registrationDeadline', event.registrationDeadline);

    if (event.end && !event.start) problems.push(`${label}: has an "end" time but no "start" time.`);
    if (event.start && event.end && Date.parse(event.end) <= Date.parse(event.start)) {
      problems.push(`${label}: "end" must be after "start".`);
    }

    for (const roleId of event.volunteerRoleIds) {
      if (!getRole(roleId)) problems.push(`${label}: unknown volunteer role id "${roleId}" (see src/data/roles.ts).`);
    }
    if (new Set(event.volunteerRoleIds).size !== event.volunteerRoleIds.length) {
      problems.push(`${label}: a volunteer role id is listed twice.`);
    }

    const shiftIds = new Set<string>();
    for (const shift of event.shifts) {
      const shiftLabel = `${label} / shift ${shift.id || '(no id)'}`;
      if (!idPattern.test(shift.id)) {
        problems.push(`${shiftLabel}: shift "id" may only contain lowercase letters, numbers, and hyphens.`);
      }
      if (shift.id === ANY_SHIFT_ID) problems.push(`${shiftLabel}: "${ANY_SHIFT_ID}" is reserved.`);
      if (shiftIds.has(shift.id)) problems.push(`${shiftLabel}: this shift id is used more than once in the event.`);
      shiftIds.add(shift.id);
      if (!shift.label.trim()) problems.push(`${shiftLabel}: "label" is empty.`);
      checkTime(shiftLabel, 'start', shift.start);
      checkTime(shiftLabel, 'end', shift.end);
      if (isIsoWithOffset(shift.start) && isIsoWithOffset(shift.end) && Date.parse(shift.end) <= Date.parse(shift.start)) {
        problems.push(`${shiftLabel}: "end" must be after "start".`);
      }
    }

    if (event.publicationStatus === 'published' && event.registrationStatus === 'open' && event.volunteerRoleIds.length === 0) {
      problems.push(`${label}: registration is open but no volunteer roles are enabled.`);
    }
    if (event.isDemo && !event.id.startsWith('demo-')) {
      problems.push(`${label}: demo events must have an id starting with "demo-".`);
    }
  }
  return problems;
}

/** Form value meaning "I can help with any shift". */
export const ANY_SHIFT_ID = 'any-shift';

/** Form value for the "Future volunteer opportunities" path (no specific event). */
export const FUTURE_OPPORTUNITIES_ID = 'future-opportunities';
