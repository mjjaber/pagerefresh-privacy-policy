import { losAngelesDateAt, losAngelesWallTimeToIso } from '../lib/datetime';
import type { CommunityEvent } from '../types/events';

/**
 * DEMO FIXTURES — for local preview only.
 *
 * These are invented examples so the team can see how events look while
 * developing. They are NOT real announcements:
 *   - they only appear in `npm run dev` (never in the published site),
 *   - every one is labelled "Demo" on screen,
 *   - the form refuses to submit a request for a demo event.
 *
 * Real events belong in src/data/events.ts.
 *
 * Dates are generated relative to today so the demos never go stale.
 */

/** A date `weeksAhead` Saturdays from now, as Los Angeles calendar parts. */
function saturday(now: Date, weeksAhead: number): { year: number; month: number; day: number } {
  const today = losAngelesDateAt(now);
  const daysUntilSaturday = (6 - today.weekday + 7) % 7 || 7;
  // Noon UTC keeps date arithmetic clear of daylight saving edge cases.
  const target = new Date(Date.UTC(today.year, today.month - 1, today.day + daysUntilSaturday + 7 * weeksAhead, 12));
  return { year: target.getUTCFullYear(), month: target.getUTCMonth() + 1, day: target.getUTCDate() };
}

export function buildDemoEvents(now: Date = new Date()): CommunityEvent[] {
  const walk = saturday(now, 2);
  const parkDay = saturday(now, 5);
  const cancelled = saturday(now, 3);
  const at = (d: { year: number; month: number; day: number }, hour: number, minute = 0) =>
    losAngelesWallTimeToIso(d.year, d.month, d.day, hour, minute);

  return [
    {
      id: 'demo-ontario-community-walk',
      title: 'Demo: Community Walk',
      city: 'Ontario',
      venue: 'Example Park (demo venue, not a real location)',
      address: undefined,
      start: at(walk, 9),
      end: at(walk, 11, 30),
      timezone: 'America/Los_Angeles',
      summary:
        'A sample listing showing how a relaxed neighborhood walk with a small education table would appear.',
      description: [
        'This is demonstration content for previewing the website. It does not describe a real event.',
        'A real listing would explain who the event is for, what to bring, and where to meet.',
      ],
      plannedActivities: [
        'A gentle group walk at a comfortable pace',
        'An education table with approved printed materials',
        'Water and a rest area',
      ],
      volunteerRoleIds: ['setup-cleanup', 'welcome-checkin', 'activity-support', 'language-support', 'wherever-needed'],
      shifts: [
        { id: 'demo-walk-setup', label: 'Setup', start: at(walk, 8), end: at(walk, 9) },
        { id: 'demo-walk-event', label: 'During the walk', start: at(walk, 9), end: at(walk, 11, 30) },
        { id: 'demo-walk-cleanup', label: 'Cleanup', start: at(walk, 11, 30), end: at(walk, 12, 15) },
      ],
      volunteerExpectations: [
        'Sample expectation: arrive 10 minutes before your shift.',
        'Sample expectation: wear comfortable shoes and bring water.',
      ],
      publicationStatus: 'published',
      registrationStatus: 'open',
      isDemo: true,
    },
    {
      id: 'demo-eastvale-park-awareness-day',
      title: 'Demo: Park Awareness Day',
      city: 'Eastvale',
      venue: 'Example Community Park (demo venue, not a real location)',
      address: undefined,
      start: at(parkDay, 10),
      end: at(parkDay, 13),
      timezone: 'America/Los_Angeles',
      summary:
        'A sample listing showing how a family friendly morning in the park with education tables would appear.',
      description: [
        'This is demonstration content for previewing the website. It does not describe a real event.',
        'It includes the healthcare professional role so the team can preview the optional professional questions.',
      ],
      plannedActivities: [
        'Education tables with approved printed materials',
        'Family activities and games',
        'Conversations about everyday healthy habits',
      ],
      volunteerRoleIds: [
        'welcome-checkin',
        'education-table',
        'activity-support',
        'healthcare-professional',
        'wherever-needed',
      ],
      shifts: [
        { id: 'demo-park-morning', label: 'First half', start: at(parkDay, 9, 30), end: at(parkDay, 11, 30) },
        { id: 'demo-park-midday', label: 'Second half', start: at(parkDay, 11, 30), end: at(parkDay, 13, 30) },
      ],
      volunteerExpectations: ['Sample expectation: a short briefing happens at the start of each shift.'],
      publicationStatus: 'published',
      registrationStatus: 'open',
      registrationDeadline: at(parkDay, 0),
      admission: 'Sample policy text: free to attend.',
      isDemo: true,
    },
    {
      id: 'demo-ontario-family-morning',
      title: 'Demo: Family Activity Morning',
      city: 'Ontario',
      venue: 'Example Recreation Center (demo venue, not a real location)',
      address: undefined,
      start: at(cancelled, 9),
      end: at(cancelled, 11),
      timezone: 'America/Los_Angeles',
      summary: 'A sample listing showing how a cancelled event stays visible for volunteers who had signed up.',
      description: ['This is demonstration content for previewing the website. It does not describe a real event.'],
      plannedActivities: ['Family activities'],
      volunteerRoleIds: ['setup-cleanup', 'activity-support'],
      shifts: [],
      volunteerExpectations: [],
      publicationStatus: 'cancelled',
      registrationStatus: 'closed',
      cancellationNote: 'Sample notice: this event was cancelled. Organizers will contact volunteers who had signed up.',
      isDemo: true,
    },
  ];
}
