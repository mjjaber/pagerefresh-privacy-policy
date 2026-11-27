import { siteConfig } from '../config/site.config';
import { copy } from '../content/en';
import { hasAnyContact } from './ContactDetails';
import { Wordmark } from './Wordmark';

interface FooterProps {
  privacyHref: string;
  homeHref?: string;
}

export function Footer({ privacyHref, homeHref = '' }: FooterProps) {
  const { contact, socialLinks } = siteConfig;
  const year = new Date().getFullYear();
  const footerLink = 'inline-flex min-h-11 items-center font-semibold text-white underline decoration-2 underline-offset-4 hover:text-gold';

  return (
    <footer className="on-dark bg-charcoal text-sage">
      <div className="page-container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark tone="light" />
          <p className="mt-4 font-semibold text-white">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-md text-[0.9375rem]">{copy.disclaimer}</p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold tracking-[0.14em] text-white uppercase">{copy.footer.serviceAreaLabel}</h2>
          <p className="mt-3">{siteConfig.serviceArea.summary}</p>
          <p className="text-[0.9375rem]">{siteConfig.serviceArea.region}</p>
        </div>

        <div>
          {hasAnyContact() && (
            <>
              <h2 className="text-sm font-extrabold tracking-[0.14em] text-white uppercase">{copy.footer.contactLabel}</h2>
              <ul className="mt-1">
                {contact.organizerName && <li className="mt-2">{contact.organizerName}</li>}
                {contact.email && (
                  <li>
                    <a className={`${footerLink} break-all`} href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a className={footerLink} href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}
          <ul className={hasAnyContact() ? 'mt-4' : ''}>
            <li>
              <a className={footerLink} href={privacyHref}>
                {copy.footer.privacyLink}
              </a>
            </li>
            {socialLinks.map((social) => (
              <li key={social.url}>
                <a className={footerLink} href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.label}
                  <span className="sr-only"> {copy.externalLinkNote}</span>
                </a>
              </li>
            ))}
            <li>
              <a className={footerLink} href={homeHref || '#top'}>
                {homeHref ? copy.privacy.backHome : copy.footer.backToTop}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="page-container py-5 text-sm">
          © {year} {siteConfig.name}. {copy.footer.rights}
        </p>
      </div>
    </footer>
  );
}
