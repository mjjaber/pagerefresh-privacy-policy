import { siteConfig } from '../config/site.config';

/** The logo mark: rising steps with a small sun. Purely decorative. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className="shrink-0">
      <rect width="64" height="64" rx="16" fill="var(--brand-teal)" />
      <path
        d="M12 46h12v-9h12v-9h12v-9h6"
        fill="none"
        stroke="var(--brand-warm-white)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46" cy="14" r="5" fill="var(--brand-gold)" />
    </svg>
  );
}

/** Logo mark plus the initiative's name as text, so it stays editable and accessible. */
export function Wordmark({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [first, ...rest] = siteConfig.name.split(' ');
  const second = rest.slice(0, 1).join(' ');
  const remainder = rest.slice(1).join(' ');
  return (
    <span className="inline-flex items-center gap-3">
      <LogoMark />
      <span className="flex flex-col leading-none whitespace-nowrap">
        <span className={`text-lg font-extrabold tracking-tight ${tone === 'light' ? 'text-white' : 'text-charcoal'}`}>
          {first} {second}
        </span>
        {remainder && (
          <span
            className={`mt-1 text-[0.6875rem] font-bold tracking-[0.18em] uppercase ${tone === 'light' ? 'text-sage' : 'text-teal'}`}
          >
            {remainder}
          </span>
        )}
      </span>
    </span>
  );
}
