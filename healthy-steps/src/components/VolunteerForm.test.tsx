import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copy } from '../content/en';
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
import { VolunteerForm } from './VolunteerForm';

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  // Pin "today" so the synthetic events are always upcoming. Only Date is
  // faked; timers stay real so simulated typing works normally.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(TEST_NOW);
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const events = [walkEvent, parkEvent, noShiftEvent, closedEvent, deadlinePassedEvent, cancelledEvent, pastEvent];

function renderForm(overrides: Partial<Parameters<typeof VolunteerForm>[0]> = {}) {
  const user = userEvent.setup();
  render(<VolunteerForm events={events} privacyHref="privacy.html" formId="testform1" {...overrides} />);
  return { user };
}

const eventSelect = () => screen.getByLabelText(copy.form.eventLabel);
const roleGroup = () => screen.getByRole('group', { name: copy.form.roleLegend });
const shiftGroup = () => screen.getByRole('group', { name: copy.form.shiftLegend });

async function fillValidRequest(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(eventSelect(), walkEvent.id);
  await user.click(within(roleGroup()).getByRole('radio', { name: /Welcome and check in/ }));
  await user.click(within(shiftGroup()).getByRole('radio', { name: /Setup/ }));
  await user.type(screen.getByLabelText(copy.form.nameLabel), 'Synthetic Tester');
  await user.type(screen.getByLabelText(copy.form.emailLabel), 'tester@example.com');
  await user.click(screen.getByRole('checkbox', { name: copy.form.consentLabel }));
}

const submit = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: copy.form.submit }));

describe('choosing an event', () => {
  it('lists only events that are accepting requests, plus future opportunities', () => {
    renderForm();
    const options = within(eventSelect()).getAllByRole('option').map((option) => option.textContent);
    expect(options).toHaveLength(5);
    expect(options[0]).toBe(copy.form.eventPlaceholder);
    expect(options.slice(1, 4).join('|')).toMatch(/Test Walk.*Test Park Day.*Test Table Day/);
    expect(options[4]).toBe(copy.form.futureOption);
    for (const hidden of ['Test Closed Event', 'Test Deadline Event', 'Test Cancelled Event', 'Test Past Event']) {
      expect(options.join('|')).not.toContain(hidden);
    }
  });

  it('shows a summary and only the roles and shifts of the chosen event', async () => {
    const { user } = renderForm();
    await user.selectOptions(eventSelect(), walkEvent.id);

    expect(screen.getByText(copy.form.summaryTitle)).toBeInTheDocument();
    const roles = within(roleGroup()).getAllByRole('radio');
    expect(roles).toHaveLength(walkEvent.volunteerRoleIds.length);
    expect(within(roleGroup()).queryByRole('radio', { name: /Education table/ })).not.toBeInTheDocument();
    // Two shifts plus "Any shift".
    expect(within(shiftGroup()).getAllByRole('radio')).toHaveLength(3);
    expect(within(shiftGroup()).getByRole('radio', { name: /Setup \(8:00 AM – 9:00 AM PDT\)/ })).toBeInTheDocument();
  });

  it('clears the role and shift when the event changes to one that does not offer them', async () => {
    const { user } = renderForm();
    await user.selectOptions(eventSelect(), walkEvent.id);
    await user.click(within(roleGroup()).getByRole('radio', { name: /Event setup and cleanup/ }));
    await user.click(within(shiftGroup()).getByRole('radio', { name: /Setup/ }));

    await user.selectOptions(eventSelect(), parkEvent.id);

    for (const radio of within(roleGroup()).getAllByRole('radio')) expect(radio).not.toBeChecked();
    for (const radio of within(shiftGroup()).getAllByRole('radio')) expect(radio).not.toBeChecked();
    expect(within(shiftGroup()).getByRole('radio', { name: /Early/ })).toBeInTheDocument();
    expect(within(shiftGroup()).queryByRole('radio', { name: /Setup/ })).not.toBeInTheDocument();
  });

  it('keeps a role both events offer but still clears the shift', async () => {
    const { user } = renderForm();
    await user.selectOptions(eventSelect(), walkEvent.id);
    await user.click(within(roleGroup()).getByRole('radio', { name: /Welcome and check in/ }));
    await user.click(within(shiftGroup()).getByRole('radio', { name: /Any shift/ }));

    await user.selectOptions(eventSelect(), parkEvent.id);

    expect(within(roleGroup()).getByRole('radio', { name: /Welcome and check in/ })).toBeChecked();
    for (const radio of within(shiftGroup()).getAllByRole('radio')) expect(radio).not.toBeChecked();
  });

  it('does not ask for a shift on the future opportunities path', async () => {
    const { user } = renderForm();
    await user.selectOptions(eventSelect(), copy.form.futureOption);
    expect(screen.queryByRole('group', { name: copy.form.shiftLegend })).not.toBeInTheDocument();
    expect(screen.getByText(copy.form.summaryFuture)).toBeInTheDocument();
    expect(within(roleGroup()).getAllByRole('radio').length).toBeGreaterThan(3);
  });

  it('preselects future opportunities when no event is accepting requests', () => {
    renderForm({ events: [closedEvent, cancelledEvent, pastEvent] });
    expect(eventSelect()).toHaveDisplayValue(copy.form.futureOption);
    expect(screen.getByText(copy.form.noOpenEvents)).toBeInTheDocument();
  });

  it('shows the optional professional questions only for the healthcare role', async () => {
    const { user } = renderForm();
    await user.selectOptions(eventSelect(), parkEvent.id);
    expect(screen.queryByLabelText(new RegExp(copy.form.professionalCategoryLabel))).not.toBeInTheDocument();
    await user.click(within(roleGroup()).getByRole('radio', { name: /Nurse or healthcare professional/ }));
    expect(screen.getByLabelText(new RegExp(copy.form.professionalCategoryLabel))).not.toBeRequired();
    expect(screen.getByText(copy.form.healthcareNotice)).toBeInTheDocument();
  });
});

describe('validation', () => {
  it('shows inline errors linked to their fields and sends nothing', async () => {
    const { user } = renderForm();
    await submit(user);

    const summary = screen.getByRole('alert');
    expect(summary).toHaveTextContent(copy.form.errorSummaryTitle(5));
    expect(summary).toHaveFocus();

    const email = screen.getByLabelText(copy.form.emailLabel);
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription(/Enter your email address/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('keeps what was typed after an error and clears each error once it is fixed', async () => {
    const { user } = renderForm();
    await user.type(screen.getByLabelText(copy.form.nameLabel), 'Synthetic Tester');
    await user.type(screen.getByLabelText(copy.form.emailLabel), 'not-an-email');
    await submit(user);

    expect(screen.getByLabelText(copy.form.nameLabel)).toHaveValue('Synthetic Tester');
    const email = screen.getByLabelText(copy.form.emailLabel);
    expect(email).toHaveValue('not-an-email');
    expect(email).toHaveAttribute('aria-invalid', 'true');

    await user.type(email, '@example.com');
    expect(email).not.toHaveAttribute('aria-invalid');
  });
});

describe('sending a request', () => {
  it('shows the success message and summary only after the service accepts the request', async () => {
    let respond: (response: Response) => void = () => {};
    fetchMock.mockReturnValue(new Promise<Response>((resolve) => (respond = resolve)));
    const { user } = renderForm();
    await fillValidRequest(user);
    await submit(user);

    // Still waiting for the service: no success yet.
    expect(screen.getByRole('button', { name: copy.form.submitting })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText(copy.form.successTitle)).not.toBeInTheDocument();

    respond(jsonResponse(200, { ok: true, next: '/thanks' }));

    const heading = await screen.findByRole('heading', { name: copy.form.successTitle });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(screen.getByText(copy.form.successText)).toBeInTheDocument();
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Test Walk');
    expect(status).toHaveTextContent('Welcome and check in');
    expect(status).toHaveTextContent('Setup (8:00 AM – 9:00 AM PDT)');
    // No claim that a confirmation email was sent.
    expect(status).not.toHaveTextContent(/confirmation email/i);
  });

  it('sends the event, role, and shift ids and labels with the consent version', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));
    const { user } = renderForm();
    await fillValidRequest(user);
    await submit(user);
    await screen.findByText(copy.form.successTitle);

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('https://formspree.io/f/testform1');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      eventId: 'test-walk',
      eventTitle: 'Test Walk',
      roleId: 'welcome-checkin',
      shiftId: 'walk-setup',
      name: 'Synthetic Tester',
      email: 'tester@example.com',
      consentToContact: 'yes',
    });
  });

  it('ignores repeated clicks while a request is being sent', async () => {
    let respond: (response: Response) => void = () => {};
    fetchMock.mockReturnValue(new Promise<Response>((resolve) => (respond = resolve)));
    const { user } = renderForm();
    await fillValidRequest(user);
    await submit(user);
    await user.click(screen.getByRole('button', { name: copy.form.submitting }));
    await user.click(screen.getByRole('button', { name: copy.form.submitting }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    respond(jsonResponse(200, { ok: true }));
    await screen.findByText(copy.form.successTitle);
  });

  it.each([
    ['a connection failure', () => Promise.reject(new TypeError('Failed to fetch')), 'network'],
    ['a submission limit', () => Promise.resolve(jsonResponse(429, { error: 'limit' })), 'rate-limited'],
    ['a provider error', () => Promise.resolve(new Response('oops', { status: 500 })), 'unavailable'],
    ['an unclear response', () => Promise.resolve(jsonResponse(200, {})), 'unconfirmed'],
  ] as const)('explains %s honestly, keeps the answers, and does not retry', async (_label, respond, kind) => {
    fetchMock.mockImplementation(respond);
    const { user } = renderForm();
    await fillValidRequest(user);
    await submit(user);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(copy.form.failure[kind].title);
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.queryByText(copy.form.successTitle)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Everything the visitor entered is still there.
    expect(screen.getByLabelText(copy.form.nameLabel)).toHaveValue('Synthetic Tester');
    expect(screen.getByLabelText(copy.form.emailLabel)).toHaveValue('tester@example.com');
    expect(eventSelect()).toHaveValue(walkEvent.id);
    expect(within(roleGroup()).getByRole('radio', { name: /Welcome and check in/ })).toBeChecked();
    expect(screen.getByRole('button', { name: copy.form.submit })).toHaveAttribute('aria-disabled', 'false');
  });

  it('shows provider field errors next to the field', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(422, { errors: [{ code: 'TYPE_EMAIL', field: 'email', message: 'should be an email' }] }),
    );
    const { user } = renderForm();
    await fillValidRequest(user);
    await submit(user);

    await screen.findByText(copy.form.failure.validation.title);
    expect(screen.getByLabelText(copy.form.emailLabel)).toHaveAttribute('aria-invalid', 'true');
  });

  it('can succeed on a second attempt after a failure', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    const { user } = renderForm();
    await fillValidRequest(user);
    await submit(user);
    await screen.findByText(copy.form.failure.network.title);

    await submit(user);
    await screen.findByText(copy.form.successTitle);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('requests that must never be sent', () => {
  it('blocks demo events', async () => {
    const { user } = renderForm({ events: [demoEvent] });
    await user.selectOptions(eventSelect(), demoEvent.id);
    expect(screen.getByText(copy.events.demoNotice)).toBeInTheDocument();
    await user.click(within(roleGroup()).getByRole('radio', { name: /Welcome and check in/ }));
    await user.click(within(shiftGroup()).getByRole('radio', { name: /Any shift/ }));
    await user.type(screen.getByLabelText(copy.form.nameLabel), 'Synthetic Tester');
    await user.type(screen.getByLabelText(copy.form.emailLabel), 'tester@example.com');
    await user.click(screen.getByRole('checkbox', { name: copy.form.consentLabel }));
    await submit(user);

    expect(screen.getByRole('alert')).toHaveTextContent(/demo event/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('blocks an event that stops accepting requests while the form is open', async () => {
    const { user } = renderForm();
    await fillValidRequest(user);
    vi.setSystemTime(new Date('2027-03-21T09:00:00-07:00'));
    await submit(user);

    expect(screen.getByRole('alert')).toHaveTextContent(/no longer accepting volunteer requests/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows an unavailable notice instead of the form when no form id is configured', () => {
    renderForm({ formId: null });
    expect(screen.getByRole('heading', { name: copy.form.unavailableTitle })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: copy.form.submit })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(copy.form.emailLabel)).not.toBeInTheDocument();
  });
});
