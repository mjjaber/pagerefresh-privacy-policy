/**
 * Shareable event links use a query parameter (?event=ID) on the main
 * page. GitHub Pages serves the same static index.html whatever the query
 * string is, so these links survive a refresh and work under any
 * /REPOSITORY/ path without special routing.
 */
export const EVENT_PARAM = 'event';

/** Reads the requested event ID from a URL query string such as "?event=abc". */
export function readEventIdFromSearch(search: string): string | null {
  const value = new URLSearchParams(search).get(EVENT_PARAM);
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Builds the shareable address for an event from the page's current address. */
export function buildEventLink(eventId: string, currentHref: string): string {
  const url = new URL(currentHref);
  url.search = '';
  url.searchParams.set(EVENT_PARAM, eventId);
  url.hash = 'events';
  return url.toString();
}

/** A link that opens an address in the visitor's maps app. Nothing is embedded or loaded. */
export function buildMapLink(venue: string | undefined, address: string): string {
  const query = [venue, address].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
