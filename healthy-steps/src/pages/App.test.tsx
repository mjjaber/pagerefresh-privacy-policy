import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copy } from '../content/en';
import {
  cancelledEvent,
  closedEvent,
  deadlinePassedEvent,
  draftEvent,
  parkEvent,
  pastEvent,
  TEST_NOW,
  walkEvent,
} from '../test/fixtures';
import { App } from './App';

// The form is "configured" for these tests; no real network request is made.
vi.mock('../config/env', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../config/env')>()),
  formspreeFormId: 'testform1',
}));

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(TEST_NOW);
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const allEvents = [parkEvent, walkEvent, closedEvent, deadlinePassedEvent, cancelledEvent, pastEvent, draftEvent];

function renderApp(props: Partial<Parameters<typeof App>[0]> = {}) {
  const user = userEvent.setup();
  render(<App events={allEvents} search="" {...props} />);
  return { user };
}

const eventsSection = () => screen.getByRole('region', { name: copy.events.title });
const eventArticle = (title: string) => within(eventsSection()).getByRole('article', { name: title });
const eventSelect = () => screen.getByLabelText(copy.form.eventLabel);

describe('events list', () => {
  it('shows upcoming events soonest first, and never shows drafts', () => {
    renderApp();
    const titles = within(eventsSection())
      .getAllByRole('article')
      .map((article) => within(article).getByRole('heading', { level: 3 }).textContent);
    expect(titles).toEqual([
      'Test Cancelled Event',
      'Test Closed Event',
      'Test Deadline Event',
      'Test Walk',
      'Test Park Day',
    ]);
    expect(screen.queryByText('Test Draft Event')).not.toBeInTheDocument();
    // Past events move to their own short list.
    expect(within(eventsSection()).getByText('Test Past Event')).toBeInTheDocument();
  });

  it('filters by location and offers a way back when nothing matches', async () => {
    const { user } = renderApp({ events: [walkEvent] });
    await user.click(screen.getByRole('radio', { name: 'Eastvale' }));
    expect(within(eventsSection()).queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByText(copy.events.emptyFilterTitle('Eastvale'))).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: copy.events.emptyFilterAction }));
    expect(eventArticle('Test Walk')).toBeInTheDocument();
  });

  it('shows an honest empty state when no events are announced', () => {
    renderApp({ events: [] });
    expect(screen.getByText(copy.events.emptyAllTitle)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(copy.hero.withoutEvents))).toBeInTheDocument();
    expect(screen.getByText(copy.nextEvent.noneTitle)).toBeInTheDocument();
    expect(eventSelect()).toHaveDisplayValue(copy.form.futureOption);
  });

  it('reveals location, activities, roles, and shifts when details are opened', async () => {
    const { user } = renderApp();
    const article = eventArticle('Test Walk');
    const toggle = within(article).getByRole('button', { name: /Show details/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(within(article).getByRole('button', { name: /Hide details/ })).toHaveAttribute('aria-expanded', 'true');
    expect(within(article).getByText('Test Venue')).toBeInTheDocument();
    expect(within(article).getByText('Synthetic activity')).toBeInTheDocument();
    expect(within(article).getByText('Synthetic expectation')).toBeInTheDocument();
    expect(within(article).getByText('8:00 AM – 9:00 AM PDT')).toBeInTheDocument();
    expect(within(article).getByText(copy.events.capacityNote)).toBeInTheDocument();
  });
});

describe('volunteering for an event', () => {
  it('preselects the event in the form and moves focus to it', async () => {
    const { user } = renderApp();
    await user.click(within(eventArticle('Test Park Day')).getByRole('button', { name: /Volunteer for this event/ }));

    expect(eventSelect()).toHaveValue(parkEvent.id);
    await waitFor(() => expect(eventSelect()).toHaveFocus());
    // Roles come from the chosen event.
    const roles = screen.getByRole('group', { name: copy.form.roleLegend });
    expect(within(roles).getAllByRole('radio')).toHaveLength(parkEvent.volunteerRoleIds.length);
  });

  it('switching to another event from its card resets an incompatible role and the shift', async () => {
    const { user } = renderApp();
    await user.click(within(eventArticle('Test Walk')).getByRole('button', { name: /Volunteer for this event/ }));
    const roles = () => screen.getByRole('group', { name: copy.form.roleLegend });
    const shifts = () => screen.getByRole('group', { name: copy.form.shiftLegend });
    await user.click(within(roles()).getByRole('radio', { name: /Event setup and cleanup/ }));
    await user.click(within(shifts()).getByRole('radio', { name: /Setup/ }));

    await user.click(within(eventArticle('Test Park Day')).getByRole('button', { name: /Volunteer for this event/ }));

    expect(eventSelect()).toHaveValue(parkEvent.id);
    for (const radio of within(roles()).getAllByRole('radio')) expect(radio).not.toBeChecked();
    for (const radio of within(shifts()).getAllByRole('radio')) expect(radio).not.toBeChecked();
  });

  it.each([
    ['closed', 'Test Closed Event', copy.events.status.closed],
    ['past its deadline', 'Test Deadline Event', copy.events.status['deadline-passed']],
    ['cancelled', 'Test Cancelled Event', copy.events.status.cancelled],
  ])('offers no way to volunteer for an event that is %s', (_label, title, statusText) => {
    renderApp();
    const article = eventArticle(title);
    expect(within(article).getByText(statusText)).toBeInTheDocument();
    expect(within(article).queryByRole('button', { name: /Volunteer for this event/ })).not.toBeInTheDocument();
    const options = within(eventSelect()).getAllByRole('option').map((option) => option.textContent);
    expect(options.join('|')).not.toContain(title);
  });

  it('keeps a cancellation notice visible', () => {
    renderApp();
    const article = eventArticle('Test Cancelled Event');
    expect(within(article).getByText(copy.events.cancelledNotice)).toBeInTheDocument();
    expect(within(article).getByText('Synthetic cancellation note.')).toBeInTheDocument();
  });

  it('does not offer past events in the form', () => {
    renderApp();
    const options = within(eventSelect()).getAllByRole('option').map((option) => option.textContent);
    expect(options.join('|')).not.toContain('Test Past Event');
  });
});

describe('shared event links', () => {
  it('opens and focuses the linked event', async () => {
    renderApp({ search: `?event=${parkEvent.id}` });
    const article = eventArticle('Test Park Day');
    expect(within(article).getByText(copy.events.linkedNotice)).toBeInTheDocument();
    expect(within(article).getByRole('button', { name: /Hide details/ })).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(within(article).getByRole('heading', { level: 3 })).toHaveFocus());
  });

  it('keeps the linked event visible even when a filter would hide it', async () => {
    const { user } = renderApp({ search: `?event=${parkEvent.id}` });
    await user.click(screen.getByRole('radio', { name: 'Ontario' }));
    expect(eventArticle('Test Park Day')).toBeInTheDocument();
    expect(within(eventsSection()).getByRole('article', { name: 'Test Walk' })).toBeInTheDocument();
  });

  it('shows a linked past event in full, without a volunteer button', () => {
    renderApp({ search: `?event=${pastEvent.id}` });
    const article = eventArticle('Test Past Event');
    expect(within(article).getByText(copy.events.status.completed)).toBeInTheDocument();
    expect(within(article).queryByRole('button', { name: /Volunteer for this event/ })).not.toBeInTheDocument();
  });

  it.each([
    ['an unknown id', '?event=no-such-event'],
    ['a draft event', `?event=${draftEvent.id}`],
  ])('falls back helpfully for %s', async (_label, search) => {
    renderApp({ search });
    const notice = screen.getByText(copy.events.notFoundTitle).closest('[role="status"]');
    expect(notice).toHaveTextContent(copy.events.notFoundText);
    await waitFor(() => expect(notice).toHaveFocus());
    // The normal list is still there.
    expect(eventArticle('Test Walk')).toBeInTheDocument();
    expect(screen.queryByText('Test Draft Event')).not.toBeInTheDocument();
  });
});

describe('page structure', () => {
  it('has a skip link, landmarks, one h1, and the required disclaimer', () => {
    renderApp();
    expect(screen.getByRole('link', { name: copy.skipLink })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByText(copy.disclaimer).length).toBeGreaterThanOrEqual(2);
  });

  it('does not show demo events or a language toggle outside local development', () => {
    render(<App search="" />);
    expect(screen.queryByText(/Demo:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Español/i)).not.toBeInTheDocument();
  });
});
