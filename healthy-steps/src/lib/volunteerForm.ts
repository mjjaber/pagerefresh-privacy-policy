import { siteConfig } from '../config/site.config';
import { futureInterestRoleIds, getRole, getRoles } from '../data/roles';
import type { CommunityEvent, VolunteerRole, VolunteerShift } from '../types/events';
import { formatShortDate, formatTimeRange } from './datetime';
import { ANY_SHIFT_ID, FUTURE_OPPORTUNITIES_ID, getRegistrationState } from './events';

/** Everything the visitor can enter on the volunteer form. */
export interface VolunteerFormValues {
  /** An event ID, FUTURE_OPPORTUNITIES_ID, or '' when nothing is chosen yet. */
  eventId: string;
  roleId: string;
  shiftId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  languages: string;
  skills: string;
  professionalCategory: string;
  professionalExperience: string;
  note: string;
  consent: boolean;
  /** Honeypot. Real people never see or fill this field. */
  gotcha: string;
}

export type FieldName = keyof VolunteerFormValues;
export type FieldErrors = Partial<Record<FieldName, string>>;

export const emptyFormValues: VolunteerFormValues = {
  eventId: '',
  roleId: '',
  shiftId: '',
  fullName: '',
  email: '',
  phone: '',
  city: '',
  languages: '',
  skills: '',
  professionalCategory: '',
  professionalExperience: '',
  note: '',
  consent: false,
  gotcha: '',
};

export const isFuturePath = (eventId: string): boolean => eventId === FUTURE_OPPORTUNITIES_ID;

/** Roles offered for the current selection: the event's enabled roles, or the general list. */
export function getRoleOptions(event: CommunityEvent | undefined, eventId: string): VolunteerRole[] {
  if (isFuturePath(eventId)) return getRoles(futureInterestRoleIds);
  return event ? getRoles(event.volunteerRoleIds) : [];
}

/** Shifts offered for the current selection. Empty when shifts do not apply. */
export function getShiftOptions(event: CommunityEvent | undefined, eventId: string): VolunteerShift[] {
  if (isFuturePath(eventId) || !event) return [];
  return event.shifts;
}

/**
 * Applies a new event choice. A role is kept only if the new event also
 * offers it; a shift never carries over, because shifts belong to one event.
 */
export function changeEvent(
  values: VolunteerFormValues,
  nextEventId: string,
  nextEvent: CommunityEvent | undefined,
): VolunteerFormValues {
  const roleStillOffered = getRoleOptions(nextEvent, nextEventId).some((role) => role.id === values.roleId);
  const shiftStillOffered =
    values.eventId === nextEventId &&
    (values.shiftId === ANY_SHIFT_ID || getShiftOptions(nextEvent, nextEventId).some((s) => s.id === values.shiftId));
  const roleId = roleStillOffered ? values.roleId : '';
  const stillHealthcare = getRole(roleId)?.isHealthcare === true;
  return {
    ...values,
    eventId: nextEventId,
    roleId,
    shiftId: shiftStillOffered ? values.shiftId : '',
    professionalCategory: stillHealthcare ? values.professionalCategory : '',
    professionalExperience: stillHealthcare ? values.professionalExperience : '',
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ValidationContext {
  event: CommunityEvent | undefined;
  now: Date;
}

/** Checks the form. Returns an empty object when everything is fine. */
export function validateForm(values: VolunteerFormValues, { event, now }: ValidationContext): FieldErrors {
  const errors: FieldErrors = {};
  const future = isFuturePath(values.eventId);

  if (!values.eventId) {
    errors.eventId = 'Choose an event, or choose “Future volunteer opportunities”.';
  } else if (!future) {
    if (!event) {
      errors.eventId = 'That event is no longer listed. Please choose another option.';
    } else if (event.isDemo) {
      errors.eventId = 'This is a demo event for previewing the website. Requests cannot be sent for demo events.';
    } else if (!getRegistrationState(event, now).isOpen) {
      errors.eventId = 'This event is no longer accepting volunteer requests. Please choose another option.';
    }
  }

  const roles = getRoleOptions(event, values.eventId);
  if (!values.roleId) {
    errors.roleId = 'Choose the role you would prefer.';
  } else if (values.eventId && !roles.some((role) => role.id === values.roleId)) {
    errors.roleId = 'That role is not available for this event. Please choose another.';
  }

  const shifts = getShiftOptions(event, values.eventId);
  if (shifts.length > 0) {
    const valid = values.shiftId === ANY_SHIFT_ID || shifts.some((shift) => shift.id === values.shiftId);
    if (!values.shiftId) errors.shiftId = 'Choose a shift, or choose “Any shift”.';
    else if (!valid) errors.shiftId = 'That shift is not available for this event. Please choose another.';
  }

  if (!values.fullName.trim()) errors.fullName = 'Enter your full name.';
  else if (values.fullName.trim().length > 120) errors.fullName = 'Please shorten your name to 120 characters or fewer.';

  const email = values.email.trim();
  if (!email) errors.email = 'Enter your email address so an organizer can reply.';
  else if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  const phone = values.phone.trim();
  if (phone && (phone.replace(/\D/g, '').length < 7 || phone.length > 30)) {
    errors.phone = 'Enter a phone number with area code, or leave this blank.';
  }

  if (values.note.length > siteConfig.noteMaxLength) {
    errors.note = `Please shorten your note to ${siteConfig.noteMaxLength} characters or fewer.`;
  }

  if (!values.consent) {
    errors.consent = 'Please agree to be contacted about this request so an organizer can reply.';
  }

  return errors;
}

/** The order fields appear on screen; used to move focus to the first problem. */
export const fieldOrder: FieldName[] = [
  'eventId',
  'roleId',
  'shiftId',
  'professionalCategory',
  'professionalExperience',
  'fullName',
  'email',
  'phone',
  'city',
  'languages',
  'skills',
  'note',
  'consent',
];

/** A short, human-readable description of what was requested. */
export interface RequestSummary {
  eventTitle: string;
  eventWhen: string | null;
  eventWhere: string | null;
  roleLabel: string;
  shiftLabel: string | null;
}

export function describeShift(shift: VolunteerShift): string {
  return `${shift.label} (${formatTimeRange(shift.start, shift.end)})`;
}

export function buildRequestSummary(values: VolunteerFormValues, event: CommunityEvent | undefined): RequestSummary {
  const roleLabel = getRole(values.roleId)?.label ?? 'Not specified';
  if (isFuturePath(values.eventId) || !event) {
    return {
      eventTitle: 'Future volunteer opportunities',
      eventWhen: null,
      eventWhere: null,
      roleLabel,
      shiftLabel: null,
    };
  }
  const shift = event.shifts.find((s) => s.id === values.shiftId);
  const shiftLabel = shift ? describeShift(shift) : values.shiftId === ANY_SHIFT_ID ? 'Any shift' : null;
  return {
    eventTitle: event.title,
    eventWhen: event.start ? `${formatShortDate(event.start)}, ${formatTimeRange(event.start, event.end)}` : null,
    eventWhere: [event.venue, event.city].filter(Boolean).join(', ') || null,
    roleLabel,
    shiftLabel,
  };
}

/** The fields sent to the form service. Plain strings only. */
export type SubmissionPayload = Record<string, string>;

/**
 * Builds what is sent to the form service. IDs and labels are both
 * included so organizers can read a request without looking anything up.
 * Organizers should treat every value as unverified until they review it.
 */
export function buildSubmissionPayload(
  values: VolunteerFormValues,
  event: CommunityEvent | undefined,
): SubmissionPayload {
  const summary = buildRequestSummary(values, event);
  const future = isFuturePath(values.eventId) || !event;
  const role = getRole(values.roleId);

  const payload: SubmissionPayload = {
    _subject: `Volunteer request: ${summary.eventTitle} (${summary.roleLabel})`,
    requestType: future ? 'future-opportunities' : 'event',
    eventId: future ? FUTURE_OPPORTUNITIES_ID : event.id,
    eventTitle: summary.eventTitle,
    roleId: values.roleId,
    roleLabel: summary.roleLabel,
    name: values.fullName.trim(),
    email: values.email.trim(),
    consentToContact: 'yes',
    consentNoticeVersion: siteConfig.privacy.consentNoticeVersion,
  };

  const optional: Record<string, string | null> = {
    eventWhen: summary.eventWhen,
    eventWhere: summary.eventWhere,
    shiftId: future || !values.shiftId ? null : values.shiftId,
    shiftLabel: summary.shiftLabel,
    phone: values.phone.trim(),
    city: values.city.trim(),
    languages: values.languages.trim(),
    skills: values.skills.trim(),
    professionalCategory: role?.isHealthcare ? values.professionalCategory : null,
    professionalExperience: role?.isHealthcare ? values.professionalExperience.trim() : null,
    note: values.note.trim(),
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value) payload[key] = value;
  }

  // Formspree's honeypot field: filled in only by automated spam tools.
  if (values.gotcha) payload._gotcha = values.gotcha;
  return payload;
}
