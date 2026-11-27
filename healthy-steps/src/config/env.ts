/**
 * Public build-time settings. These come from VITE_* environment variables
 * (see .env.example) and are baked into the published JavaScript, so they
 * must never hold private credentials.
 */

const FORM_ID_PATTERN = /^[A-Za-z0-9_-]{4,64}$/;

/** Returns the Formspree form ID if one is configured and well-formed. */
export function readFormspreeFormId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  return FORM_ID_PATTERN.test(value) ? value : null;
}

export const formspreeFormId = readFormspreeFormId(import.meta.env.VITE_FORMSPREE_FORM_ID);

/**
 * Demo events are for local preview only: on in `npm run dev`, off in the
 * production build unless VITE_SHOW_DEMO_EVENTS is explicitly "true".
 */
export const showDemoEvents =
  import.meta.env.MODE === 'development' || import.meta.env.VITE_SHOW_DEMO_EVENTS === 'true';

/** The site's base path, always ending in "/". Works under /REPOSITORY/. */
export const basePath = import.meta.env.BASE_URL;

export const isDevelopment = import.meta.env.MODE === 'development';
