/**
 * The shape of an event. See src/data/events.ts for a filled-in template
 * and the README for a step-by-step guide to adding one.
 */

/** A timestamp with an explicit UTC offset, e.g. "2027-03-13T09:00:00-08:00". */
export type IsoDateTimeWithOffset = string;

/**
 * - draft:     not shown on the site at all.
 * - published: shown on the site.
 * - cancelled: shown with a cancellation notice; never accepts requests.
 * - completed: shown under "Past events"; never accepts requests.
 *              (Events also count as completed automatically once their
 *              end time passes.)
 */
export type PublicationStatus = 'draft' | 'published' | 'cancelled' | 'completed';

/** Whether organizers are currently accepting volunteer requests. */
export type RegistrationStatus = 'open' | 'closed';

export interface VolunteerShift {
  /** Stable ID, unique within the event. Never reuse or rename after publishing. */
  id: string;
  /** Short name, e.g. "Morning setup". */
  label: string;
  start: IsoDateTimeWithOffset;
  end: IsoDateTimeWithOffset;
}

export interface CommunityEvent {
  /** Stable ID used in shared links (?event=ID). Never change after publishing. */
  id: string;
  title: string;
  /** City name. Use one of siteConfig.serviceArea.filterCities when it applies. */
  city: string;
  /** Leave undefined until confirmed — the site shows "Venue to be confirmed". */
  venue?: string;
  /** Street address. Leave undefined until confirmed. */
  address?: string;
  /** Leave undefined until confirmed — the site shows "Date to be confirmed". */
  start?: IsoDateTimeWithOffset;
  end?: IsoDateTimeWithOffset;
  /** IANA timezone the event takes place in. */
  timezone: 'America/Los_Angeles';
  /** One or two sentences for the event card. */
  summary: string;
  /** Longer description shown in the expanded details. One string per paragraph. */
  description: string[];
  plannedActivities: string[];
  /** IDs from src/data/roles.ts that organizers have enabled for this event. */
  volunteerRoleIds: string[];
  /** Optional. When present, volunteers must pick a shift (or "any shift"). */
  shifts: VolunteerShift[];
  /** What volunteers should know before they sign up. */
  volunteerExpectations: string[];
  publicationStatus: PublicationStatus;
  registrationStatus: RegistrationStatus;
  /** Requests stop being accepted after this moment. */
  registrationDeadline?: IsoDateTimeWithOffset;
  /** Shown with a cancelled event, e.g. why, or whether it will be rescheduled. */
  cancellationNote?: string;
  /** Verified event policies. Leave undefined rather than guessing. */
  admission?: string;
  ageGuidance?: string;
  accessibility?: string;
  /** Set only by the demo fixtures. Demo events can never be submitted. */
  isDemo?: boolean;
}

export interface VolunteerRole {
  /** Stable ID. Never change after publishing — organizers see it in requests. */
  id: string;
  label: string;
  description: string;
  /** Shows the optional professional questions and the credentials notice. */
  isHealthcare?: boolean;
}
