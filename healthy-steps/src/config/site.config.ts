/**
 * Organization settings — the ONE place to edit names, contact details,
 * colors, and policies. Everything on the site reads from here.
 *
 * Rule of thumb: leave a value as an empty string until it is real and
 * verified. Empty values are simply hidden on the site (and listed in the
 * launch checklist shown during `npm run dev`). Never fill in a guess.
 */
export const siteConfig = {
  /** Working name — replace when the initiative has a final name. */
  name: 'Healthy Steps Inland Empire',
  shortName: 'Healthy Steps',
  tagline: 'Small steps. Stronger communities.',
  description:
    'A community prediabetes awareness initiative in Ontario and Eastvale, California. Find local awareness events and ask to volunteer.',

  serviceArea: {
    /** Shown near the headline and in the footer. */
    summary: 'Ontario, Eastvale, and nearby Inland Empire communities',
    region: 'Inland Empire, California',
    /** Cities offered as event filters, in display order. */
    filterCities: ['Ontario', 'Eastvale'],
  },

  /**
   * Verified organizer contact. Leave empty until confirmed — the site then
   * hides contact links and tells visitors honestly that contact details
   * are still being set up.
   */
  contact: {
    organizerName: '',
    email: '',
    phone: '',
  } as { organizerName: string; email: string; phone: string },

  /** Only add real, active accounts. Empty list = no social links shown. */
  socialLinks: [] as { label: string; url: string }[],

  /**
   * Initiative-wide policies for the FAQ. Leave empty until confirmed;
   * the FAQ then points people to each event's details instead.
   */
  policies: {
    admission: '',
    ageEligibility: '',
    accessibility: '',
  } as { admission: string; ageEligibility: string; accessibility: string },

  privacy: {
    /** Date the privacy notice was last reviewed, e.g. "January 15, 2027". */
    lastUpdated: '',
    /**
     * How long volunteer requests are kept, in plain words, e.g.
     * "We delete volunteer requests 12 months after the event."
     * Leave empty until the organizers have actually chosen a policy.
     */
    retention: '',
    /**
     * Version label sent with every request so organizers know which
     * consent wording the volunteer saw. Change it whenever the consent
     * checkbox text or the privacy notice changes in a meaningful way.
     */
    consentNoticeVersion: '2026-11-v1',
  } as { lastUpdated: string; retention: string; consentNoticeVersion: string },

  /** All event times are shown in this timezone. */
  timezone: 'America/Los_Angeles',

  /** How many finished or past events stay listed under "Past events". */
  pastEventsShown: 3,

  /** Maximum length of the optional note on the volunteer form. */
  noteMaxLength: 500,

  /**
   * Brand colors. These are injected into both pages as CSS variables at
   * build time (see vite.config.ts) and used by src/styles/index.css.
   * `npm test` checks the text/background pairs used on the site against
   * WCAG AA contrast — run it after changing any color.
   */
  colors: {
    warmWhite: '#F8FAF7',
    white: '#FFFFFF',
    teal: '#115E59',
    tealDark: '#0B4541',
    sage: '#DCEADD',
    sageDark: '#C3D9C6',
    charcoal: '#17352F',
    /** Secondary text. */
    muted: '#44615A',
    /** Form field and card outlines (needs 3:1 against backgrounds). */
    border: '#6B8A82',
    gold: '#E4AD43',
    goldSoft: '#FBF1D9',
    /** Errors and cancellations. */
    danger: '#A4281B',
    dangerSoft: '#FCEBE8',
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type BrandColor = keyof SiteConfig['colors'];

/** True when a verified organizer email has been supplied. */
export const hasContactEmail = (): boolean => siteConfig.contact.email.trim().length > 0;
/** True when a verified organizer phone number has been supplied. */
export const hasContactPhone = (): boolean => siteConfig.contact.phone.trim().length > 0;
