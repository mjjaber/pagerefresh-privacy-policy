import type { CommunityEvent } from '../types/events';

/**
 * Synthetic events for automated tests only. Nothing here is real.
 * Tests pin "now" to TEST_NOW so results never depend on today's date.
 */
export const TEST_NOW = new Date('2027-03-01T12:00:00-08:00');

export function makeEvent(overrides: Partial<CommunityEvent> = {}): CommunityEvent {
  return {
    id: 'test-walk',
    title: 'Test Walk',
    city: 'Ontario',
    venue: 'Test Venue',
    address: '1 Test Street, Ontario, CA',
    start: '2027-03-20T09:00:00-07:00',
    end: '2027-03-20T11:00:00-07:00',
    timezone: 'America/Los_Angeles',
    summary: 'A synthetic event used by automated tests.',
    description: ['Synthetic description.'],
    plannedActivities: ['Synthetic activity'],
    volunteerRoleIds: ['setup-cleanup', 'welcome-checkin', 'wherever-needed'],
    shifts: [
      { id: 'walk-setup', label: 'Setup', start: '2027-03-20T08:00:00-07:00', end: '2027-03-20T09:00:00-07:00' },
      { id: 'walk-main', label: 'Main event', start: '2027-03-20T09:00:00-07:00', end: '2027-03-20T11:00:00-07:00' },
    ],
    volunteerExpectations: ['Synthetic expectation'],
    publicationStatus: 'published',
    registrationStatus: 'open',
    ...overrides,
  };
}

export const walkEvent = makeEvent();

export const parkEvent = makeEvent({
  id: 'test-park-day',
  title: 'Test Park Day',
  city: 'Eastvale',
  venue: 'Test Park',
  start: '2027-04-10T10:00:00-07:00',
  end: '2027-04-10T13:00:00-07:00',
  volunteerRoleIds: ['welcome-checkin', 'education-table', 'healthcare-professional'],
  shifts: [
    { id: 'park-early', label: 'Early', start: '2027-04-10T09:30:00-07:00', end: '2027-04-10T11:30:00-07:00' },
    { id: 'park-late', label: 'Late', start: '2027-04-10T11:30:00-07:00', end: '2027-04-10T13:30:00-07:00' },
  ],
});

export const noShiftEvent = makeEvent({
  id: 'test-no-shifts',
  title: 'Test Table Day',
  start: '2027-05-01T10:00:00-07:00',
  end: '2027-05-01T12:00:00-07:00',
  shifts: [],
});

export const closedEvent = makeEvent({ id: 'test-closed', title: 'Test Closed Event', registrationStatus: 'closed' });

export const deadlinePassedEvent = makeEvent({
  id: 'test-deadline',
  title: 'Test Deadline Event',
  registrationDeadline: '2027-02-28T23:59:00-08:00',
});

export const cancelledEvent = makeEvent({
  id: 'test-cancelled',
  title: 'Test Cancelled Event',
  publicationStatus: 'cancelled',
  cancellationNote: 'Synthetic cancellation note.',
});

export const pastEvent = makeEvent({
  id: 'test-past',
  title: 'Test Past Event',
  start: '2027-02-06T09:00:00-08:00',
  end: '2027-02-06T11:00:00-08:00',
  shifts: [],
});

export const draftEvent = makeEvent({ id: 'test-draft', title: 'Test Draft Event', publicationStatus: 'draft' });

export const demoEvent = makeEvent({ id: 'demo-test-event', title: 'Demo: Test Event', isDemo: true });
