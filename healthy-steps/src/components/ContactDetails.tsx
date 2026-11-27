import { hasContactEmail, hasContactPhone, siteConfig } from '../config/site.config';
import { MailIcon, PhoneIcon } from './Icons';

/**
 * The verified organizer contact from site.config.ts. Renders nothing when
 * no contact has been supplied, so the site never shows a made-up address.
 */
export function ContactDetails({ className = '' }: { className?: string }) {
  if (!hasContactEmail() && !hasContactPhone()) return null;
  const { organizerName, email, phone } = siteConfig.contact;
  return (
    <ul className={`space-y-1 ${className}`}>
      {organizerName && <li className="font-bold">{organizerName}</li>}
      {hasContactEmail() && (
        <li>
          <a className="text-link inline-flex min-h-11 items-center gap-2 break-all" href={`mailto:${email}`}>
            <MailIcon className="shrink-0" width={18} height={18} />
            {email}
          </a>
        </li>
      )}
      {hasContactPhone() && (
        <li>
          <a className="text-link inline-flex min-h-11 items-center gap-2" href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
            <PhoneIcon className="shrink-0" width={18} height={18} />
            {phone}
          </a>
        </li>
      )}
    </ul>
  );
}

export const hasAnyContact = (): boolean => hasContactEmail() || hasContactPhone();
