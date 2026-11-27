import { describe, expect, it } from 'vitest';
import { buildEventLink, readEventIdFromSearch } from './links';

describe('shareable event links', () => {
  it('reads the event id from the query string', () => {
    expect(readEventIdFromSearch('?event=test-walk')).toBe('test-walk');
    expect(readEventIdFromSearch('?utm=x&event=test-walk')).toBe('test-walk');
    expect(readEventIdFromSearch('')).toBeNull();
    expect(readEventIdFromSearch('?event=')).toBeNull();
  });

  it('keeps the repository path so links work on a GitHub Pages project site', () => {
    expect(buildEventLink('test-walk', 'https://username.github.io/repository/healthy-steps/?event=old#faq')).toBe(
      'https://username.github.io/repository/healthy-steps/?event=test-walk#events',
    );
    expect(buildEventLink('test-walk', 'https://username.github.io/repository/index.html')).toBe(
      'https://username.github.io/repository/index.html?event=test-walk#events',
    );
  });
});
