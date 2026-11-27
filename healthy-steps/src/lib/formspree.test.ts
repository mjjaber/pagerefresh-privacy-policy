import { describe, expect, it, vi } from 'vitest';
import { readFormspreeFormId } from '../config/env';
import { FORMSPREE_ENDPOINT, submitVolunteerRequest } from './formspree';

/** Synthetic payload. No real person's details are used in tests. */
const payload = { name: 'Synthetic Tester', email: 'tester@example.com', eventId: 'test-walk' };

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const mockFetch = (response: Response | Error) =>
  vi.fn<typeof fetch>(() => (response instanceof Error ? Promise.reject(response) : Promise.resolve(response)));

describe('submitVolunteerRequest', () => {
  it('posts JSON to the Formspree endpoint for the configured form', async () => {
    const fetchMock = mockFetch(jsonResponse(200, { ok: true, next: '/thanks' }));
    await submitVolunteerRequest('testform1', payload, fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(`${FORMSPREE_ENDPOINT}testform1`);
    expect(init?.method).toBe('POST');
    expect(init?.headers).toMatchObject({ Accept: 'application/json', 'Content-Type': 'application/json' });
    expect(JSON.parse(String(init?.body))).toEqual(payload);
  });

  it('reports success only when the service acknowledges the request', async () => {
    expect(await submitVolunteerRequest('testform1', payload, mockFetch(jsonResponse(200, { ok: true })))).toEqual({
      status: 'success',
    });
    expect(
      await submitVolunteerRequest('testform1', payload, mockFetch(jsonResponse(200, { next: '/thanks' }))),
    ).toEqual({ status: 'success' });
  });

  it('does not report success for a 200 response that fails to confirm acceptance', async () => {
    const unexpected = await submitVolunteerRequest('testform1', payload, mockFetch(jsonResponse(200, {})));
    expect(unexpected).toMatchObject({ status: 'error', kind: 'unconfirmed' });
    const notJson = await submitVolunteerRequest(
      'testform1',
      payload,
      mockFetch(new Response('<html>ok</html>', { status: 200 })),
    );
    expect(notJson).toMatchObject({ status: 'error', kind: 'unconfirmed' });
  });

  it('maps field errors from the service back to form fields', async () => {
    const response = jsonResponse(422, {
      errors: [{ code: 'TYPE_EMAIL', field: 'email', message: 'should be an email' }],
    });
    const result = await submitVolunteerRequest('testform1', payload, mockFetch(response));
    expect(result).toMatchObject({ status: 'error', kind: 'validation' });
    expect(result.status === 'error' && result.fieldErrors.email).toMatch(/email address/);
  });

  it('reports rate limiting and submission limits honestly', async () => {
    const result = await submitVolunteerRequest('testform1', payload, mockFetch(jsonResponse(429, { error: 'limit' })));
    expect(result).toMatchObject({ status: 'error', kind: 'rate-limited' });
  });

  it('reports an unavailable form or service', async () => {
    const inactive = jsonResponse(403, { errors: [{ code: 'INACTIVE', message: 'Form not active' }] });
    expect(await submitVolunteerRequest('testform1', payload, mockFetch(inactive))).toMatchObject({ kind: 'unavailable' });
    const missing = jsonResponse(404, { error: 'Form not found' });
    expect(await submitVolunteerRequest('testform1', payload, mockFetch(missing))).toMatchObject({ kind: 'unavailable' });
    const serverError = new Response('oops', { status: 503 });
    expect(await submitVolunteerRequest('testform1', payload, mockFetch(serverError))).toMatchObject({
      kind: 'unavailable',
    });
  });

  it('reports other refusals (such as spam protection) without claiming success', async () => {
    const blocked = jsonResponse(403, { errors: [{ code: 'BLOCKED', message: 'Blocked' }] });
    expect(await submitVolunteerRequest('testform1', payload, mockFetch(blocked))).toMatchObject({
      status: 'error',
      kind: 'rejected',
    });
  });

  it('treats a connection failure as uncertain and never retries by itself', async () => {
    const fetchMock = mockFetch(new TypeError('Failed to fetch'));
    const result = await submitVolunteerRequest('testform1', payload, fetchMock);
    expect(result).toMatchObject({ status: 'error', kind: 'network' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('readFormspreeFormId', () => {
  it('accepts a well formed public form id', () => {
    expect(readFormspreeFormId('xayzabcd')).toBe('xayzabcd');
    expect(readFormspreeFormId('  xayzabcd ')).toBe('xayzabcd');
  });

  it('treats a missing or malformed id as "not configured"', () => {
    expect(readFormspreeFormId(undefined)).toBeNull();
    expect(readFormspreeFormId('')).toBeNull();
    expect(readFormspreeFormId('https://formspree.io/f/xayzabcd')).toBeNull();
    expect(readFormspreeFormId('abc')).toBeNull();
  });
});
