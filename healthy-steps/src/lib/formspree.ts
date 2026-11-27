import type { FieldName } from './volunteerForm';
import type { SubmissionPayload } from './volunteerForm';

/**
 * Sends a volunteer request to Formspree's submission API.
 *
 * Endpoint and JSON shapes follow Formspree's official client
 * (@formspree/core): POST https://formspree.io/f/{formId} with
 * "Accept: application/json"; success responses carry `ok`/`next`, error
 * responses carry `error` or `errors: [{ code, field, message }]`.
 *
 * Design rules:
 *   - Success is reported ONLY when Formspree acknowledges the request.
 *   - Nothing is retried automatically. If the outcome is uncertain the
 *     visitor is told so, rather than risking duplicate or lost requests.
 *   - Nothing is logged to the console or saved in the browser.
 */

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/';
const REQUEST_TIMEOUT_MS = 20_000;

export type SubmissionFailure =
  /** The service rejected specific fields (for example the email address). */
  | 'validation'
  /** Too many requests, or the form's submission allowance is used up. */
  | 'rate-limited'
  /** The form is disabled, missing, or the service is having problems. */
  | 'unavailable'
  /** The service refused this request (for example, flagged by spam protection). */
  | 'rejected'
  /** No response: offline, blocked, or timed out. The request may or may not have arrived. */
  | 'network'
  /** A response arrived but did not clearly confirm the request was accepted. */
  | 'unconfirmed';

export type SubmissionResult =
  | { status: 'success' }
  | { status: 'error'; kind: SubmissionFailure; fieldErrors: Partial<Record<FieldName, string>> };

interface ServerError {
  code?: unknown;
  field?: unknown;
  message?: unknown;
}

/** Maps the field names we send to the form fields a visitor sees. */
const serverFieldToFormField: Record<string, FieldName> = {
  name: 'fullName',
  email: 'email',
  phone: 'phone',
  city: 'city',
  languages: 'languages',
  skills: 'skills',
  note: 'note',
  roleId: 'roleId',
  shiftId: 'shiftId',
  eventId: 'eventId',
};

const friendlyFieldMessage: Record<string, string> = {
  TYPE_EMAIL: 'The signup service did not accept this email address. Please check it and try again.',
  REQUIRED_FIELD_EMPTY: 'The signup service needs this field. Please fill it in and try again.',
  REQUIRED_FIELD_MISSING: 'The signup service needs this field. Please fill it in and try again.',
};

const UNAVAILABLE_CODES = new Set(['INACTIVE', 'FORM_NOT_FOUND', 'PROJECT_NOT_FOUND']);

const failure = (
  kind: SubmissionFailure,
  fieldErrors: Partial<Record<FieldName, string>> = {},
): SubmissionResult => ({ status: 'error', kind, fieldErrors });

function readErrors(body: unknown): ServerError[] {
  if (typeof body !== 'object' || body === null) return [];
  const errors = (body as { errors?: unknown }).errors;
  return Array.isArray(errors) ? (errors.filter((e) => typeof e === 'object' && e !== null) as ServerError[]) : [];
}

function isAcknowledged(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;
  const { ok, next } = body as { ok?: unknown; next?: unknown };
  return ok === true || typeof next === 'string';
}

export async function submitVolunteerRequest(
  formId: string,
  payload: SubmissionPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmissionResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetchImpl(`${FORMSPREE_ENDPOINT}${encodeURIComponent(formId)}`, {
      method: 'POST',
      mode: 'cors',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    // Offline, blocked, or timed out. We cannot know whether it arrived.
    return failure('network');
  } finally {
    clearTimeout(timer);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (response.ok) {
    return isAcknowledged(body) ? { status: 'success' } : failure('unconfirmed');
  }

  if (response.status === 429) return failure('rate-limited');
  if (response.status >= 500) return failure('unavailable');

  const errors = readErrors(body);
  const fieldErrors: Partial<Record<FieldName, string>> = {};
  let formUnavailable = response.status === 404;

  for (const error of errors) {
    const code = typeof error.code === 'string' ? error.code : '';
    const field = typeof error.field === 'string' ? serverFieldToFormField[error.field] : undefined;
    if (field) {
      fieldErrors[field] =
        friendlyFieldMessage[code] ?? 'The signup service did not accept this answer. Please check it and try again.';
    } else if (UNAVAILABLE_CODES.has(code)) {
      formUnavailable = true;
    }
  }

  if (Object.keys(fieldErrors).length > 0) return failure('validation', fieldErrors);
  if (formUnavailable) return failure('unavailable');
  return failure('rejected');
}
