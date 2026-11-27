import { siteConfig } from '../config/site.config';

const TIME_ZONE = siteConfig.timezone;
const LOCALE = 'en-US';

const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

/** True for timestamps like "2027-03-13T09:00:00-08:00" that parse to a real date. */
export function isIsoWithOffset(value: string): boolean {
  return ISO_WITH_OFFSET.test(value) && !Number.isNaN(Date.parse(value));
}

/** Intl output uses narrow no-break spaces; plain spaces are easier to read and test. */
const tidy = (text: string): string => text.replace(/[\u202f\u00a0]/g, ' ');

const longDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const shortDate = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const timeOnly = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
});

const zoneName = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  timeZoneName: 'short',
});

const dateParts = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  month: 'short',
  day: 'numeric',
  weekday: 'short',
});

/** "Saturday, March 13, 2027" in Los Angeles time. */
export function formatLongDate(iso: string): string {
  return tidy(longDate.format(new Date(iso)));
}

/** "Sat, Mar 13, 2027" in Los Angeles time. */
export function formatShortDate(iso: string): string {
  return tidy(shortDate.format(new Date(iso)));
}

/** "9:00 AM" in Los Angeles time. */
export function formatTime(iso: string): string {
  return tidy(timeOnly.format(new Date(iso)));
}

/** "PST" or "PDT", whichever applies on that date. */
export function formatZoneAbbreviation(iso: string): string {
  const part = zoneName.formatToParts(new Date(iso)).find((p) => p.type === 'timeZoneName');
  return part?.value ?? 'PT';
}

/** "9:00 AM – 11:30 AM PST" in Los Angeles time. */
export function formatTimeRange(startIso: string, endIso?: string): string {
  const zone = formatZoneAbbreviation(startIso);
  if (!endIso) return `${formatTime(startIso)} ${zone}`;
  return `${formatTime(startIso)} – ${formatTime(endIso)} ${zone}`;
}

/** Month, day and weekday pieces for the calendar-style date tile. */
export function getDateTileParts(iso: string): { month: string; day: string; weekday: string } {
  const parts = dateParts.formatToParts(new Date(iso));
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return { month: pick('month'), day: pick('day'), weekday: pick('weekday') };
}

/** The UTC offset in effect in Los Angeles at a given instant, e.g. "-07:00". */
export function losAngelesOffsetAt(instant: Date): string {
  const formatter = new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, timeZoneName: 'longOffset' });
  const name = formatter.formatToParts(instant).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT-08:00';
  const match = /GMT([+-]\d{2}:\d{2})/.exec(name);
  return match?.[1] ?? '-08:00';
}

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Builds an ISO timestamp with the correct Los Angeles offset for a wall
 * clock time, handling daylight saving. Used by the demo fixtures, which
 * need dates that are always in the future.
 */
export function losAngelesWallTimeToIso(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
): string {
  // Los Angeles is 7 or 8 hours behind UTC, so this instant falls on the
  // right calendar day there and tells us which offset applies.
  const approximate = new Date(Date.UTC(year, month - 1, day, hour + 8, minute));
  const offset = losAngelesOffsetAt(approximate);
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${offset}`;
}

/** The calendar date in Los Angeles at a given instant. */
export function losAngelesDateAt(instant: Date): { year: number; month: number; day: number; weekday: number } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const parts = formatter.formatToParts(instant);
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return {
    year: Number(pick('year')),
    month: Number(pick('month')),
    day: Number(pick('day')),
    weekday: weekdays.indexOf(pick('weekday')),
  };
}
