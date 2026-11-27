import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { copy } from '../content/en';
import { App } from './App';

// No Formspree form ID, exactly like a build where the variable is missing.
vi.mock('../config/env', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../config/env')>()),
  formspreeFormId: null,
}));

describe('when the signup form is not configured', () => {
  it('still renders the site, shows the unavailable notice, and promises nothing', () => {
    render(<App events={[]} search="" />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: copy.form.unavailableTitle })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: copy.form.submit })).not.toBeInTheDocument();
    expect(screen.queryByText(new RegExp(copy.hero.withoutEventsSignup))).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: copy.nextEvent.noneAction })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: copy.events.emptyAllAction })).not.toBeInTheDocument();
  });
});
