import { describe, expect, it } from 'vitest';
import { siteConfig } from '../config/site.config';
import {
  cancelledEvent,
  closedEvent,
  deadlinePassedEvent,
  demoEvent,
  noShiftEvent,
  parkEvent,
  pastEvent,
  TEST_NOW,
  walkEvent,
} from '../test/fixtures';
import { ANY_SHIFT_ID, FUTURE_OPPORTUNITIES_ID } from './events';
import {
  buildSubmissionPayload,
  changeEvent,
  emptyFormValues,
  getRoleOptions,
  getShiftOptions,
  validateForm,
  type VolunteerFormValues,
} from './volunteerForm';

const complete: VolunteerFormValues = {
  ...emptyFormValues,
  eventId: walkEvent.id,
  roleId: 'welcome-checkin',
  shiftId: 'walk-setup',
  fullName: 'Synthetic Tester',
  email: 'tester@example.com',
  consent: true,
};

describe('role and shift options come from the chosen event', () => {
  it('offers only the roles enabled for the event', () => {
    expect(getRoleOptions(walkEvent, walkEvent.id).map((r) => r.id)).toEqual([
      'setup-cleanup',
      'welcome-checkin',
      'wherever-needed',
    ]);
    expect(getShiftOptions(walkEvent, walkEvent.id).map((s) => s.id)).toEqual(['walk-setup', 'walk-main']);
  });

  it('offers the general role list and no shifts for future opportunities', () => {
    expect(getRoleOptions(undefined, FUTURE_OPPORTUNITIES_ID).length).toBeGreaterThan(3);
    expect(getShiftOptions(undefined, FUTURE_OPPORTUNITIES_ID)).toEqual([]);
  });

  it('offers nothing until an event is chosen', () => {
    expect(getRoleOptions(undefined, '')).toEqual([]);
  });
});

describe('changing the event resets incompatible choices', () => {
  it('clears a role the new event does not offer, and always clears the shift', () => {
    const before = { ...complete, roleId: 'setup-cleanup', shiftId: 'walk-setup' };
    const after = changeEvent(before, parkEvent.id, parkEvent);
    expect(after.eventId).toBe(parkEvent.id);
    expect(after.roleId).toBe('');
    expect(after.shiftId).toBe('');
  });

  it('keeps a role that the new event also offers, but still clears the shift', () => {
    const after = changeEvent(complete, parkEvent.id, parkEvent);
    expect(after.roleId).toBe('welcome-checkin');
    expect(after.shiftId).toBe('');
  });

  it('clears "any shift" too, because it was chosen for a different event', () => {
    const after = changeEvent({ ...complete, shiftId: ANY_SHIFT_ID }, parkEvent.id, parkEvent);
    expect(after.shiftId).toBe('');
  });

  it('clears the shift when switching to future opportunities and keeps the role', () => {
    const after = changeEvent(complete, FUTURE_OPPORTUNITIES_ID, undefined);
    expect(after.roleId).toBe('welcome-checkin');
    expect(after.shiftId).toBe('');
  });

  it('clears professional details when the healthcare role is dropped', () => {
    const before = {
      ...complete,
      eventId: parkEvent.id,
      roleId: 'healthcare-professional',
      shiftId: 'park-early',
      professionalCategory: 'Registered nurse',
      professionalExperience: 'Synthetic experience',
    };
    const after = changeEvent(before, walkEvent.id, walkEvent);
    expect(after.roleId).toBe('');
    expect(after.professionalCategory).toBe('');
    expect(after.professionalExperience).toBe('');
  });

  it('keeps contact details the visitor already typed', () => {
    const after = changeEvent(complete, parkEvent.id, parkEvent);
    expect(after.fullName).toBe('Synthetic Tester');
    expect(after.email).toBe('tester@example.com');
    expect(after.consent).toBe(true);
  });
});

describe('validateForm', () => {
  const context = { event: walkEvent, now: TEST_NOW };

  it('accepts a complete request', () => {
    expect(validateForm(complete, context)).toEqual({});
  });

  it('requires name, email, event, role, shift, and consent', () => {
    const errors = validateForm(emptyFormValues, { event: undefined, now: TEST_NOW });
    expect(Object.keys(errors).sort()).toEqual(['consent', 'email', 'eventId', 'fullName', 'roleId']);
    const withEvent = validateForm({ ...emptyFormValues, eventId: walkEvent.id }, context);
    expect(withEvent.shiftId).toBeDefined();
  });

  it('accepts "any shift" and does not ask for a shift when the event has none', () => {
    expect(validateForm({ ...complete, shiftId: ANY_SHIFT_ID }, context)).toEqual({});
    const noShift = { ...complete, eventId: noShiftEvent.id, shiftId: '' };
    expect(validateForm(noShift, { event: noShiftEvent, now: TEST_NOW })).toEqual({});
  });

  it('does not require an event or shift on the future opportunities path', () => {
    const future = { ...complete, eventId: FUTURE_OPPORTUNITIES_ID, shiftId: '' };
    expect(validateForm(future, { event: undefined, now: TEST_NOW })).toEqual({});
  });

  it('rejects a role or shift that belongs to a different event', () => {
    const errors = validateForm({ ...complete, roleId: 'education-table', shiftId: 'park-early' }, context);
    expect(errors.roleId).toBeDefined();
    expect(errors.shiftId).toBeDefined();
  });

  it.each([
    ['closed', closedEvent],
    ['past its deadline', deadlinePassedEvent],
    ['cancelled', cancelledEvent],
    ['already over', pastEvent],
    ['a demo', demoEvent],
  ])('refuses a request for an event that is %s', (_label, event) => {
    const errors = validateForm({ ...complete, eventId: event.id }, { event, now: TEST_NOW });
    expect(errors.eventId).toBeDefined();
  });

  it('refuses an event whose deadline passes while the form is open', () => {
    const afterEvent = new Date('2027-03-21T00:00:00-07:00');
    expect(validateForm(complete, { event: walkEvent, now: afterEvent }).eventId).toBeDefined();
  });

  it('checks email format, phone format, and note length', () => {
    expect(validateForm({ ...complete, email: 'not-an-email' }, context).email).toBeDefined();
    expect(validateForm({ ...complete, phone: '12' }, context).phone).toBeDefined();
    expect(validateForm({ ...complete, phone: '(909) 555-0100' }, context).phone).toBeUndefined();
    const longNote = 'x'.repeat(siteConfig.noteMaxLength + 1);
    expect(validateForm({ ...complete, note: longNote }, context).note).toBeDefined();
  });
});

describe('buildSubmissionPayload', () => {
  it('sends ids and labels for the event, role, and shift, plus the consent version', () => {
    const payload = buildSubmissionPayload(complete, walkEvent);
    expect(payload).toMatchObject({
      requestType: 'event',
      eventId: 'test-walk',
      eventTitle: 'Test Walk',
      roleId: 'welcome-checkin',
      roleLabel: 'Welcome and check in',
      shiftId: 'walk-setup',
      shiftLabel: 'Setup (8:00 AM – 9:00 AM PDT)',
      name: 'Synthetic Tester',
      email: 'tester@example.com',
      consentToContact: 'yes',
      consentNoticeVersion: siteConfig.privacy.consentNoticeVersion,
    });
  });

  it('leaves out optional fields that were not filled in', () => {
    const payload = buildSubmissionPayload(complete, walkEvent);
    for (const key of ['phone', 'city', 'languages', 'skills', 'note', 'professionalCategory', '_gotcha']) {
      expect(payload).not.toHaveProperty(key);
    }
  });

  it('marks future opportunity requests and sends no shift', () => {
    const payload = buildSubmissionPayload({ ...complete, eventId: FUTURE_OPPORTUNITIES_ID }, undefined);
    expect(payload.requestType).toBe('future-opportunities');
    expect(payload.eventId).toBe(FUTURE_OPPORTUNITIES_ID);
    expect(payload).not.toHaveProperty('shiftId');
  });

  it('only sends professional details with the healthcare role', () => {
    const values = { ...complete, professionalCategory: 'Registered nurse', professionalExperience: 'Synthetic' };
    expect(buildSubmissionPayload(values, walkEvent)).not.toHaveProperty('professionalCategory');
    const asNurse = { ...values, eventId: parkEvent.id, roleId: 'healthcare-professional', shiftId: 'park-early' };
    expect(buildSubmissionPayload(asNurse, parkEvent).professionalCategory).toBe('Registered nurse');
  });
});
