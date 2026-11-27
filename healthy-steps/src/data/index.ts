import { showDemoEvents } from '../config/env';
import type { CommunityEvent } from '../types/events';
import { buildDemoEvents } from './demo-events';
import { events } from './events';

/**
 * Every event the site may show: the real events, plus the demo fixtures
 * when previewing locally. In the published build `showDemoEvents` is
 * false, so demo content is not shown (or even included in the bundle).
 */
export function loadEvents(now: Date = new Date()): CommunityEvent[] {
  return showDemoEvents ? [...events, ...buildDemoEvents(now)] : [...events];
}
