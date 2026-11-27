import type { CommunityEvent } from '../types/events';

/**
 * REAL events shown on the public website.
 *
 * To publish an event: copy the template below into the `events` list,
 * fill it in with CONFIRMED details only, commit, and push to `main`.
 * The site rebuilds and publishes automatically. The README has a
 * step-by-step guide ("Add your first real event").
 *
 * Rules that keep the site honest:
 *   - Every time needs an explicit UTC offset for Los Angeles:
 *       "-08:00" during standard time (early November to mid March)
 *       "-07:00" during daylight saving time (mid March to early November)
 *   - If a date or venue is not confirmed yet, leave that line out. The
 *     site will say "to be confirmed" instead of showing a guess.
 *   - Never change an `id` after the event is published; shared links and
 *     submitted volunteer requests refer to it.
 *   - Run `npm test` before pushing. It checks this file for mistakes such
 *     as duplicate IDs, missing offsets, or unknown role IDs.
 *
 * TEMPLATE (remove the comment markers and edit):
 *
 *   {
 *     id: '2027-03-ontario-community-walk',
 *     title: 'Community Walk',
 *     city: 'Ontario',
 *     venue: 'Name of the confirmed venue',
 *     address: 'Street address, Ontario, CA 917xx',
 *     start: '2027-03-13T09:00:00-08:00',
 *     end: '2027-03-13T11:30:00-08:00',
 *     timezone: 'America/Los_Angeles',
 *     summary: 'One or two sentences for the event card.',
 *     description: ['First paragraph of the full description.', 'Second paragraph.'],
 *     plannedActivities: ['A relaxed one mile group walk', 'An education table'],
 *     volunteerRoleIds: ['setup-cleanup', 'welcome-checkin', 'wherever-needed'],
 *     shifts: [
 *       {
 *         id: 'setup',
 *         label: 'Setup',
 *         start: '2027-03-13T08:00:00-08:00',
 *         end: '2027-03-13T09:00:00-08:00',
 *       },
 *     ],
 *     volunteerExpectations: ['Please arrive 10 minutes before your shift.'],
 *     publicationStatus: 'published',   // 'draft' | 'published' | 'cancelled' | 'completed'
 *     registrationStatus: 'open',       // 'open' | 'closed'
 *     registrationDeadline: '2027-03-10T23:59:00-08:00',   // optional
 *     admission: 'Free to attend.',                        // optional, only if confirmed
 *     ageGuidance: '',                                     // optional, only if confirmed
 *     accessibility: '',                                   // optional, only if confirmed
 *   },
 */
export const events: CommunityEvent[] = [];
