import { describe, expect, it } from 'vitest';
import { buildDemoEvents } from '../data/demo-events';
import { events as productionEvents } from '../data/events';
import {
  cancelledEvent,
  closedEvent,
  deadlinePassedEvent,
  draftEvent,
  makeEvent,
  parkEvent,
  pastEvent,
  TEST_NOW,
  walkEvent,
} from '../test/fixtures';
import {
  filterByCity,
  findPublicEvent,
  getOpenEvents,
  getRegistrationState,
  partitionEvents,
  validateEvents,
} from './events';

describe('getRegistrationState', () => {
  it('is open for a published, upcoming event with open registration', () => {
    expect(getRegistrationState(walkEvent, TEST_NOW)).toEqual({ isOpen: true, reason: 'open' });
  });

  it('is closed when organizers close registration', () => {
    expect(getRegistrationState(closedEvent, TEST_NOW)).toEqual({ isOpen: false, reason: 'closed' });
  });

  it('stays open until the registration deadline, then closes', () => {
    const event = makeEvent({ registrationDeadline: '2027-03-18T23:59:00-07:00' });
    expect(getRegistrationState(event, new Date('2027-03-18T23:58:00-07:00')).isOpen).toBe(true);
    expect(getRegistrationState(event, new Date('2027-03-18T23:59:00-07:00'))).toEqual({
      isOpen: false,
      reason: 'deadline-passed',
    });
    expect(getRegistrationState(deadlinePassedEvent, TEST_NOW).reason).toBe('deadline-passed');
  });

  it('never accepts requests for cancelled events, even if registration was left open', () => {
    expect(getRegistrationState(cancelledEvent, TEST_NOW)).toEqual({ isOpen: false, reason: 'cancelled' });
  });

  it('stops accepting requests once the event has ended', () => {
    expect(getRegistrationState(pastEvent, TEST_NOW)).toEqual({ isOpen: false, reason: 'completed' });
    // The same event flips from open to completed as time passes.
    expect(getRegistrationState(walkEvent, new Date('2027-03-20T10:59:00-07:00')).isOpen).toBe(true);
    expect(getRegistrationState(walkEvent, new Date('2027-03-20T11:00:00-07:00')).reason).toBe('completed');
  });

  it('treats events marked completed as finished whatever their dates say', () => {
    const event = makeEvent({ publicationStatus: 'completed' });
    expect(getRegistrationState(event, TEST_NOW).reason).toBe('completed');
  });

  it('never accepts requests for drafts or events without enabled roles', () => {
    expect(getRegistrationState(draftEvent, TEST_NOW).reason).toBe('draft');
    expect(getRegistrationState(makeEvent({ volunteerRoleIds: [] }), TEST_NOW).reason).toBe('no-roles');
  });

  it('allows requests for an open event whose date is not confirmed yet', () => {
    const event = makeEvent({ start: undefined, end: undefined, shifts: [] });
    expect(getRegistrationState(event, TEST_NOW).isOpen).toBe(true);
  });
});

describe('listing events', () => {
  const all = [parkEvent, pastEvent, draftEvent, cancelledEvent, walkEvent, closedEvent];

  it('shows upcoming events soonest first and hides drafts', () => {
    const { upcoming, past } = partitionEvents(all, TEST_NOW);
    expect(upcoming.map((e) => e.id)).toEqual(['test-cancelled', 'test-closed', 'test-walk', 'test-park-day']);
    expect(past.map((e) => e.id)).toEqual(['test-past']);
    expect([...upcoming, ...past].some((e) => e.id === 'test-draft')).toBe(false);
  });

  it('puts events without a confirmed date after dated ones', () => {
    const undated = makeEvent({ id: 'test-undated', start: undefined, end: undefined });
    const { upcoming } = partitionEvents([undated, walkEvent], TEST_NOW);
    expect(upcoming.map((e) => e.id)).toEqual(['test-walk', 'test-undated']);
  });

  it('filters by city', () => {
    expect(filterByCity(all, 'Eastvale').map((e) => e.id)).toEqual(['test-park-day']);
    expect(filterByCity(all, 'all')).toHaveLength(all.length);
    expect(filterByCity(all, 'Chino')).toEqual([]);
  });

  it('only offers events that are accepting requests', () => {
    expect(getOpenEvents(all, TEST_NOW).map((e) => e.id)).toEqual(['test-walk', 'test-park-day']);
  });

  it('finds public events by id and treats drafts and unknown ids as missing', () => {
    expect(findPublicEvent(all, 'test-walk')?.title).toBe('Test Walk');
    expect(findPublicEvent(all, 'test-draft')).toBeUndefined();
    expect(findPublicEvent(all, 'does-not-exist')).toBeUndefined();
  });
});

describe('validateEvents', () => {
  it('accepts well formed events', () => {
    expect(validateEvents([walkEvent, parkEvent, cancelledEvent])).toEqual([]);
  });

  it('reports timestamps that are missing an explicit offset', () => {
    const problems = validateEvents([makeEvent({ start: '2027-03-20T09:00:00' })]);
    expect(problems.join('\n')).toMatch(/"start" must be a full timestamp with a UTC offset/);
  });

  it('reports duplicate ids, unknown roles, and reversed times', () => {
    const problems = validateEvents([
      walkEvent,
      makeEvent({ volunteerRoleIds: ['not-a-role'], end: '2027-03-20T08:00:00-07:00' }),
    ]).join('\n');
    expect(problems).toMatch(/used more than once/);
    expect(problems).toMatch(/unknown volunteer role id "not-a-role"/);
    expect(problems).toMatch(/"end" must be after "start"/);
  });
});

describe('event data files', () => {
  it('src/data/events.ts has no mistakes', () => {
    expect(validateEvents(productionEvents)).toEqual([]);
  });

  it('src/data/events.ts contains no demo fixtures', () => {
    expect(productionEvents.filter((event) => event.isDemo || event.id.startsWith('demo-'))).toEqual([]);
  });

  it('demo fixtures are valid, clearly marked, and always in the future', () => {
    for (const now of [TEST_NOW, new Date('2027-03-12T12:00:00-08:00'), new Date('2027-11-05T12:00:00-07:00')]) {
      const demos = buildDemoEvents(now);
      expect(validateEvents(demos)).toEqual([]);
      for (const demo of demos) {
        expect(demo.isDemo).toBe(true);
        expect(demo.title).toMatch(/^Demo:/);
        expect(demo.address).toBeUndefined();
        expect(Date.parse(demo.start ?? '')).toBeGreaterThan(now.getTime());
      }
    }
  });
});
