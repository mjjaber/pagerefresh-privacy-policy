import { formspreeFormId } from '../config/env';
import { hasContactEmail, siteConfig } from '../config/site.config';
import { events } from '../data/events';

/**
 * Shown ONLY during local development (`npm run dev`). Lists the settings
 * that are still unresolved, so nothing gets published with a gap by
 * accident. The full checklist lives in LAUNCH-CHECKLIST.md.
 */
export function LaunchChecklist() {
  const items = [
    {
      done: formspreeFormId !== null,
      text: 'Formspree form ID set (VITE_FORMSPREE_FORM_ID). Until then the form shows “signup not available”.',
    },
    { done: hasContactEmail(), text: 'Verified organizer contact email in src/config/site.config.ts.' },
    { done: siteConfig.privacy.retention.trim() !== '', text: 'Retention policy chosen and written in site.config.ts (privacy.retention).' },
    { done: siteConfig.privacy.lastUpdated.trim() !== '', text: 'Privacy notice reviewed and dated (privacy.lastUpdated).' },
    {
      done: events.some((event) => event.publicationStatus === 'published'),
      text: 'At least one real, confirmed event in src/data/events.ts.',
    },
    {
      done: Boolean(import.meta.env.VITE_SITE_URL),
      text: 'VITE_SITE_URL set after the deployed address has been verified (enables social sharing tags).',
    },
  ];
  const remaining = items.filter((item) => !item.done).length;

  return (
    <aside aria-label="Launch checklist (development only)" className="border-charcoal bg-gold-soft border-y-4 border-dashed">
      <details className="page-container py-4">
        <summary className="cursor-pointer font-extrabold">
          Development only: launch checklist ({remaining} of {items.length} items still open)
        </summary>
        <p className="mt-2 text-[0.9375rem]">
          Visitors never see this box. Demo events are also visible only in development. See LAUNCH-CHECKLIST.md for the
          full list.
        </p>
        <ul className="mt-3 space-y-1">
          {items.map((item) => (
            <li key={item.text} className="flex items-start gap-2">
              <span className="font-extrabold">{item.done ? '[done]' : '[open]'}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </details>
    </aside>
  );
}
